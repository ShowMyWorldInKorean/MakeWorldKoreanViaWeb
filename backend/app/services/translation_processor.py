"""
Translation Processor Module

OCR 결과를 필터링하고 문단/줄 그룹화를 수행하는 핵심 기능만 포함
"""

import os
import re
import json
import numpy as np
from dotenv import load_dotenv

import logging
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
