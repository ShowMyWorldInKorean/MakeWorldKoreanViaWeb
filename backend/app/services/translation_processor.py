"""
Translation Processor Module

OCR 결과를 필터링하고 문단/줄 그룹화를 수행하는 핵심 기능만 포함
"""

import os
import re
import json
import numpy as np
import pandas as pd
import torch
import logging
from tqdm import tqdm
from transformers import (
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
    MarianMTModel,
    MarianTokenizer,
    M2M100ForConditionalGeneration,
    M2M100Tokenizer,
)
from scipy.interpolate import CubicSpline, interp1d
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()
SAVE_PATH = os.getenv('SAVE_PATH')

# TLD 리스트
tlds = (
    "com", "org", "net", "int", "edu", "gov", "mil", "info", "biz", "name", "museum", "coop", "aero", "xxx", "idv"
)

def exclude(s):
    if re.fullmatch(r'\d+(\.\d+)?', s):
        return True
    if s.startswith("www.") or re.fullmatch(r'(https?://)?(?:[-\w.]|(?:%[\da-fA-F]{2}))+(\.(?:' + '|'.join(tlds) + '))', s):
        return True
    return bool(re.fullmatch(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', s))

def exclude_key_words(bbox_file_path):
    data = json.load(open(bbox_file_path, 'r', encoding='utf-8'))
    final_data = {k: v for k, v in data.items() if not exclude(v["txt"])}
    json.dump(final_data, open(f"{SAVE_PATH}/i_s_info.json",'w'), indent=4) # pre_translation/{image_id}_i_s_info.json

def detect_para():
    alpha1 = 0.2
    alpha2 = 0.7
    beta1 = 0.4
    file = f"{SAVE_PATH}/i_s_info.json" # pre_translation/{image_id}_i_s_info.json
    
    beta1 = round(beta1, 1)

    with open(file, "r") as f:
        data = json.load(f)

    word_crops = list(data.keys())

    for i in word_crops:
        data[i]["x1"], data[i]["y1"], data[i]["x2"], data[i]["y2"] = data[i]["bbox"]
        data[i]["xc"] = (data[i]["x1"] + data[i]["x2"]) / 2
        data[i]["yc"] = (data[i]["y1"] + data[i]["y2"]) / 2
        data[i]["w"] = data[i]["x2"] - data[i]["x1"]
        data[i]["h"] = data[i]["y2"] - data[i]["y1"]

    patch_info = {}
    while word_crops:
        img_name = word_crops[0].split("_")[0]
        word_crop_collection = [
            word_crop for word_crop in word_crops if word_crop.startswith(img_name)
        ]
        centroids = {}
        lines = []
        img_word_crops = word_crop_collection.copy()
        para = []
        while img_word_crops:
            clusters = []
            para_words_group = [
                img_word_crops[0],
            ]
            added = [
                img_word_crops[0],
            ]
            img_word_crops.remove(img_word_crops[0])
            ## determining the paragraph
            while added:
                word_crop = added.pop()
                for i in range(len(img_word_crops)):
                    word_crop_ = img_word_crops[i]
                    if (
                        abs(data[word_crop_]["yc"] - data[word_crop]["yc"])
                        < data[word_crop]["h"] * alpha1
                    ):
                        if data[word_crop]["xc"] > data[word_crop_]["xc"]:
                            if (data[word_crop]["x1"] - data[word_crop_]["x2"]) < data[
                                word_crop
                            ]["h"] * alpha2:
                                para_words_group.append(word_crop_)
                                added.append(word_crop_)
                        else:
                            if (data[word_crop_]["x1"] - data[word_crop]["x2"]) < data[
                                word_crop
                            ]["h"] * alpha2:
                                para_words_group.append(word_crop_)
                                added.append(word_crop_)
                    else:
                        if data[word_crop]["yc"] > data[word_crop_]["yc"]:
                            if (data[word_crop]["y1"] - data[word_crop_]["y2"]) < data[
                                word_crop
                            ]["h"] * beta1 and (
                                (
                                    (data[word_crop_]["x1"] < data[word_crop]["x2"])
                                    and (data[word_crop_]["x1"] > data[word_crop]["x1"])
                                )
                                or (
                                    (data[word_crop_]["x2"] < data[word_crop]["x2"])
                                    and (data[word_crop_]["x2"] > data[word_crop]["x1"])
                                )
                                or (
                                    (data[word_crop]["x1"] > data[word_crop_]["x1"])
                                    and (data[word_crop]["x2"] < data[word_crop_]["x2"])
                                )
                            ):
                                para_words_group.append(word_crop_)
                                added.append(word_crop_)
                        else:
                            if (data[word_crop_]["y1"] - data[word_crop]["y2"]) < data[
                                word_crop
                            ]["h"] * beta1 and (
                                (
                                    (data[word_crop_]["x1"] < data[word_crop]["x2"])
                                    and (data[word_crop_]["x1"] > data[word_crop]["x1"])
                                )
                                or (
                                    (data[word_crop_]["x2"] < data[word_crop]["x2"])
                                    and (data[word_crop_]["x2"] > data[word_crop]["x1"])
                                )
                                or (
                                    (data[word_crop]["x1"] > data[word_crop_]["x1"])
                                    and (data[word_crop]["x2"] < data[word_crop_]["x2"])
                                )
                            ):
                                para_words_group.append(word_crop_)
                                added.append(word_crop_)
                img_word_crops = [p for p in img_word_crops if p not in para_words_group]
            ## processing for the line
            while para_words_group:
                line_words_group = [
                    para_words_group[0],
                ]
                added = [
                    para_words_group[0],
                ]
                para_words_group.remove(para_words_group[0])
                ## determining the line
                while added:
                    word_crop = added.pop()
                    for i in range(len(para_words_group)):
                        word_crop_ = para_words_group[i]
                        if (
                            abs(data[word_crop_]["yc"] - data[word_crop]["yc"])
                            < data[word_crop]["h"] * alpha1
                        ):
                            if data[word_crop]["xc"] > data[word_crop_]["xc"]:
                                if (data[word_crop]["x1"] - data[word_crop_]["x2"]) < data[
                                    word_crop
                                ]["h"] * alpha2:
                                    line_words_group.append(word_crop_)
                                    added.append(word_crop_)
                            else:
                                if (data[word_crop_]["x1"] - data[word_crop]["x2"]) < data[
                                    word_crop
                                ]["h"] * alpha2:
                                    line_words_group.append(word_crop_)
                                    added.append(word_crop_)
                    para_words_group = [
                        p for p in para_words_group if p not in line_words_group
                    ]
                xc = [data[word_crop]["xc"] for word_crop in line_words_group]
                idxs = np.argsort(xc)
                patch_cluster_ = [line_words_group[i] for i in idxs]
                line_words_group = patch_cluster_
                x1 = [data[word_crop]["x1"] for word_crop in line_words_group]
                x2 = [data[word_crop]["x2"] for word_crop in line_words_group]
                y1 = [data[word_crop]["y1"] for word_crop in line_words_group]
                y2 = [data[word_crop]["y2"] for word_crop in line_words_group]
                txt_line = [data[word_crop]["txt"] for word_crop in line_words_group]
                txt = " ".join(txt_line)
                x = [x1[0]]
                y1_ = [y1[0]]
                y2_ = [y2[0]]
                l = [len(txt_l) for txt_l in txt_line]
                for i in range(1, len(x1)):
                    x.append((x1[i] + x2[i - 1]) / 2)
                    y1_.append((y1[i] + y1[i - 1]) / 2)
                    y2_.append((y2[i] + y2[i - 1]) / 2)
                x.append(x2[-1])
                y1_.append(y1[-1])
                y2_.append(y2[-1])
                line_info = {
                    "x": x,
                    "y1": y1_,
                    "y2": y2_,
                    "l": l,
                    "txt": txt,
                    "word_crops": line_words_group,
                }
                clusters.append(line_info)
            y_ = [clusters[i]["y1"][0] for i in range(len(clusters))]
            idxs = np.argsort(y_)
            clusters_ = [clusters[i] for i in idxs]
            txt = [clusters[i]["txt"] for i in idxs]
            l = [len(t) for t in txt]
            txt = " ".join(txt)
            para_info = {"lines": clusters_, "l": l, "txt": txt}
            para.append(para_info)

        for word_crop in word_crop_collection:
            word_crops.remove(word_crop)
        patch_info[img_name] = {"para": para}

    with open(f"{SAVE_PATH}/para_info.json", "w") as f: # pre_translation/{image_id}_para_info.json
        json.dump(patch_info, f, indent=4)

def translate_de(eng_to_kor: str):
    # parser = argparse.ArgumentParser()
    # parser.add_argument("--eng_to_kor",action="store_true") #수정
    # args = parser.parse_args()
    # mode = args.eng_to_kor # 영->한
    mode = False
    if eng_to_kor == "eng_to_kor":
        mode = True
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    # mode=True
    if mode: #영한
        model_name = "NHNDQ/nllb-finetuned-en2ko"
        logger.error("tokenizer loading...")
        tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        logger.error("tokenizer loaded")
        logger.error("model loading...")
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name, trust_remote_code=True)
        logger.error("model loaded")

    else: #한영
        model_name = "Helsinki-NLP/opus-mt-ko-en"
        tokenizer = MarianTokenizer.from_pretrained(model_name, trust_remote_code=True)
        model = MarianMTModel.from_pretrained(model_name, trust_remote_code=True)

    # ip = IndicProcessor(inference=True)
    model = model.to(DEVICE)
    model.eval()
    # Set the source and target languages
    if mode:
        src_lang, tgt_lang = "eng_Latn", "kor_Hang"
    else:
        src_lang, tgt_lang = "kor_Hang", "eng_Latn"

    img2info = json.load(open(f"{SAVE_PATH}/para_info.json")) # pre_translation/{image_id}_para_info.json
    cnt=0
    # Translate each para in the list
    for img_id in tqdm(img2info.keys()):
        img_info = img2info[img_id]
        
        for i in range(len(img_info['para'])):
            word = img_info['para'][i]['txt']
            
            # # Set the source language
            # tokenizer.src_lang = src_lang

            # batch = ip.preprocess_batch(
            #     [word],
            #     src_lang=src_lang,
            #     tgt_lang=tgt_lang,
            # )
            
            # # Tokenize and encode the source text
            # inputs = tokenizer(
            #     batch,
            #     truncation=True,
            #     padding="longest",
            #     return_tensors="pt",
            #     return_attention_mask=True,
            # ).to(DEVICE)
            
            # # Generate translations
            # with torch.no_grad():
            #     generated_tokens = model.generate(
            #         **inputs,
            #         use_cache=True,
            #         min_length=0,
            #         max_length=256,
            #         num_beams=5,
            #         num_return_sequences=1,
            #     )

            # # Decode the generated tokens into text
            # with tokenizer.as_target_tokenizer():
            #     generated_tokens = tokenizer.batch_decode(
            #         generated_tokens.detach().cpu().tolist(),
            #         skip_special_tokens=True,
            #         clean_up_tokenization_spaces=True,
            #     )
            inputs = tokenizer(word, return_tensors="pt", padding=True, truncation=True)

            translated = model.generate(**inputs.to(DEVICE))
            translation = tokenizer.decode(translated[0], skip_special_tokens=True)
            
            # Postprocess the translations, including entity replacement
            # translation = ip.postprocess_batch(generated_tokens, lang=tgt_lang)[0]
            img2info[img_id]['para'][i]['trans_txt'] = translation
            if(len(translation)==0):cnt+=1
    json.dump(img2info,open(f"{SAVE_PATH}/para_info.json",'w'),indent=4) # pre_translation/{image_id}_para_info.json

def from_word_crops():
    data = json.load(open(f"{SAVE_PATH}/para_info.json", "r"))

    i_s = {}

    img_ids = data.keys()
    for img_id in img_ids:
        k = 0
        for p in range(len(data[img_id]["para"])): # 이미지에서 패러그래프의 모든 단어 리스트
            para_info = data[img_id]["para"][p]
            para_words = para_info['trans_txt'].split() 
            para_l = [len(t) for t in para_words]
            para_l = np.cumsum(para_l)/np.sum(para_l)
            trans_words_list = []
            p_l_ = para_info['l']
            p_l_ = np.cumsum(p_l_)/np.sum(p_l_) # 각 줄에 대한 누적 비율 계산
            loop_trans_words = []
            j = 0
            i = 0
            while i < len(para_words): #누적 비율 기준으로 단어들 그룹화(줄 생성)
                if para_l[i] > p_l_[j]:
                    trans_words_list.append(loop_trans_words)
                    loop_trans_words = []
                    j += 1
                else:
                    loop_trans_words.append(para_words[i])
                    i += 1
            trans_words_list.append(loop_trans_words)
            for l in range(len(para_info["lines"])):
                line_info = para_info["lines"][l]
                l_ = line_info['l']
                l_ = np.cumsum(l_)/np.sum(l_)
                l_ = np.hstack([0, l_])
                xcs = CubicSpline(l_, line_info['x'])
                y1cs = CubicSpline(l_, line_info['y1'])
                y2cs = CubicSpline(l_, line_info['y2'])          
                trans_words = trans_words_list[l]
                trans_l_ = [len(t) for t in trans_words]
                trans_l = np.cumsum(trans_l_)/np.sum(trans_l_)
                trans_l = np.hstack([0, trans_l])
                new_x = xcs(trans_l)
                new_y1 = y1cs(trans_l)
                new_y2 = y2cs(trans_l)
                ref_list = line_info['word_crops']
                ref_list = list(pd.cut(trans_l[1:], l_, labels=ref_list))
                ref_l = list(pd.cut(trans_l[1:], l_, labels=para_info["lines"][l]["l"],ordered=False))
                for i in range(len(trans_words)):
                    i_s[f"{img_id}_{k}"] = {
                        "ref_i_s": ref_list[i],
                        "bbox": [
                            int(new_x[i]),
                            int(new_y1[i]),
                            int(new_x[i+1]),
                            int(new_y2[i+1]),
                        ],
                        "trans_txt": trans_words[i],
                        "ratio": ref_l[i]/trans_l_[i],
                    }
                    k += 1
    json.dump(i_s, open(f"{SAVE_PATH}/para_info.json", "w"), indent=4)
