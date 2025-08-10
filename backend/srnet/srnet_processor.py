import cv2
import json
import os
import logging
import torch
import numpy as np
import matplotlib.pyplot as plt
from model_o_t_gen import Generator
from skimage import io
from datagen import To_tensor
from tqdm import tqdm
from PIL import Image, ImageDraw
from dotenv import load_dotenv
from diffusers import (
    EulerAncestralDiscreteScheduler,
    StableDiffusionControlNetSceneTextErasingPipeline,
    )
from glob import glob


logger = logging.getLogger(__name__)
load_dotenv()

# SAVE_PATH = os.getenv('SAVE_PATH')
CHECKPOINT = "models/eng_kor.model"


def generate_crops():
    SAVE_PATH = os.getenv('SAVE_PATH')
    folder = f"{SAVE_PATH}/origin"

    i_s_info = json.load(open(f"{SAVE_PATH}/i_s_info.json", "r"))
    para_info = json.load(open(f"{SAVE_PATH}/para_info.json", "r"))
    img_names = os.listdir(folder)
    img_info = {}
    for img in img_names:
        img_info[img.split(".")[0]] = img

    os.makedirs(f"{SAVE_PATH}/i_s", exist_ok=True)

    img_ids = para_info.keys()
    for img_id in tqdm(img_ids):
        try:
            ref_id = para_info[img_id]['ref_i_s']
            x1, y1, x2, y2 = i_s_info[ref_id]['bbox']
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            img_name = ref_id.split("_")[0]
            img = cv2.imread(os.path.join(folder, img_info[img_name]))
            img = img[y1:y2, x1:x2]
            cv2.imwrite(os.path.join(f"{SAVE_PATH}/i_s", f"{img_id}.png"), img)
        except:
            print(f"Error in {img_id}")


def modify_crops():
    SAVE_PATH = os.getenv('SAVE_PATH')
    data = json.load(open(f"{SAVE_PATH}/para_info.json", "r"))
    for k, v in tqdm(data.items()):
        try:
            img = Image.open(f"{SAVE_PATH}/i_s/{k}.png")
            w, h = img.size
            new_w = w/v['ratio']
            new_img = Image.new("RGB", (int(new_w), int(h)))
            for i in range(np.ceil(1/v['ratio']).astype(int)):
                new_img.paste(img, (int(i*w), 0))
            new_img.save(f"{SAVE_PATH}/i_s/{k}.png")
        except:
            print(f"Error in {k}")


def generate_i_t():
    logger.info("\n\n========== start generate_i_t ==========\n\n")
    SAVE_PATH = os.getenv('SAVE_PATH')
    labels = json.load(open(f'{SAVE_PATH}/para_info.json'))

    save_path = f'{SAVE_PATH}/tmp/i_t'
    temp_save_path = f'{SAVE_PATH}/tmp/i_t_temp'
    os.makedirs(save_path, exist_ok=True)
    os.makedirs(temp_save_path, exist_ok=True)

    text_image_size = '256x100'
    image_size = '256x128'

    gray_bg_path = f'{SAVE_PATH}/i_t_utils/gray_bg_256x128.png'
    # Noto Sans CJK KR (한글 지원)
    font_name = 'Noto Sans CJK KR'

    for crop_name, label in tqdm(labels.items()):
        label = label['trans_txt']

        save_file_path = os.path.join(save_path, f'{crop_name}.png')
        temp_save_file_path = os.path.join(temp_save_path, f'{crop_name}.png')

        # pango에서 한글 폰트 강제 지정
        input_text_command = f'convert -alpha set -background "rgb(121,127,141)" pango:\'\
<span font_stretch="semicondensed" foreground="#000000" font="{font_name} 30">{label}</span>\
\' png:-|convert -  \\( +clone \\) +swap -background "rgb(121,127,141)" -layers merge +repage png:-|\
convert - -trim +repage -resize {text_image_size} {temp_save_file_path}'

        os.system(input_text_command.encode('utf-8'))

        finalInputTextCommand = f'composite -gravity Center {temp_save_file_path} {gray_bg_path} png:-|convert - {save_file_path}'
        os.system(finalInputTextCommand.encode('utf-8'))

    os.system(f'rm -rf {temp_save_path}')



def make_masks():
    SAVE_PATH = os.getenv('SAVE_PATH')
    img_path = f"{SAVE_PATH}/origin"
    mask_path = f"{SAVE_PATH}/masks"
    json_file = f"{SAVE_PATH}/i_s_info.json"

    os.makedirs(mask_path,exist_ok = True)
    with open(json_file,'r') as f:
        info = json.load(f)

    logger.info("\n\n========== start def make_masks ==========\n\n")

    for img_name in tqdm(os.listdir(img_path)):
        img = Image.open(os.path.join(img_path,img_name))
        mask = Image.new('L', (img.size[0], img.size[1]), 0)
        draw = ImageDraw.Draw(mask)
        for key in info:
            if(key.split("_")[0]==img_name.split(".")[0]):
                draw.rectangle(info[key]['bbox'],fill=255)

        mask.save(os.path.join(mask_path,img_name))


def scene_text_eraser():
    SAVE_PATH = os.getenv('SAVE_PATH')
    INPUT_IMAGE_PATH = f"{SAVE_PATH}/origin"
    MASK_IMAGE_PATH = f"{SAVE_PATH}/masks"
    SAVE_IMAGE_PATH = f"{SAVE_PATH}/steo"

    os.makedirs(SAVE_IMAGE_PATH, exist_ok = True)

    model_path = "onkarsus13/controlnet_stablediffusion_scenetextEraser"

    device = torch.device(device="cuda" if torch.cuda.is_available() else "cpu")

    pipe = StableDiffusionControlNetSceneTextErasingPipeline.from_pretrained(model_path)

    pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)

    pipe.to(device)

    generator = torch.Generator(device).manual_seed(1)
    for image_name in tqdm(os.listdir(MASK_IMAGE_PATH)):
        image = Image.open(os.path.join(INPUT_IMAGE_PATH,image_name))
        mask_image = Image.open(os.path.join(MASK_IMAGE_PATH,image_name))

        original_image_size = image.size
        new_image_size = (512, 512)

        image = image.resize(new_image_size)
        mask_image = mask_image.resize(new_image_size)

        result_image = pipe(
            image,
            mask_image,
            [mask_image],
            num_inference_steps=40,
            generator=generator,
            controlnet_conditioning_scale=1.0,
            guidance_scale=1.0
        ).images[0]

        result_image = result_image.resize(original_image_size)
        result_image.save(os.path.join(SAVE_IMAGE_PATH,image_name))


def make_output_base():
    SAVE_PATH = os.getenv('SAVE_PATH')
    file = f"{SAVE_PATH}/i_s_info.json"
    folder = f"{SAVE_PATH}/origin"
    img2info = json.load(open(file,'r'))

    imgs = os.listdir(folder)
    img_id2img = {}
    for img in imgs:
        img_id = img.split(".")[0]
        img_id2img[img_id] = img
    os.system(f"cp -r {folder} {SAVE_PATH}/output_base")
    for img_id in img2info.keys():
        img_name = img_id.split("_")[0]
        img = Image.open(f"{SAVE_PATH}/output_base/{img_id2img[img_name]}")
        bg = Image.open(f"{SAVE_PATH}/steo/{img_id2img[img_name]}")
        bg = bg.crop(img2info[img_id]['bbox'])
        img.paste(bg, (int(img2info[img_id]['bbox'][0]), int(img2info[img_id]['bbox'][1])))
        img.save(f"{SAVE_PATH}/output_base/{img_id2img[img_name]}")


def make_bg():
    SAVE_PATH = os.getenv('SAVE_PATH')
    img2info = json.load(open(f"{SAVE_PATH}/para_info.json",'r'))
    os.makedirs(f"{SAVE_PATH}/bg",exist_ok=True)
    imgs = os.listdir(f"{SAVE_PATH}/output_base")
    imgs2id = {}
    for img in imgs:
        imgs2id[img.split(".")[0]] = img
    for img_id in img2info:
        try:
            x1, y1, x2, y2 = img2info[img_id]['bbox']
            img = cv2.imread(f"{SAVE_PATH}/output_base/{imgs2id[img_id.split('_')[0]]}")
            img_bg = img[y1:y2,x1:x2]
            cv2.imwrite(f"{SAVE_PATH}/bg/{img_id}.png",img_bg)
        except:
            print(img_id)


def generate_o_t():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    G = Generator(in_channels=3).to(device)

    G.eval()
    checkpoint = torch.load(CHECKPOINT, map_location=device)
    G.load_state_dict(checkpoint['generator'])

    def infer(i_s, i_t, size, model, path):
        tmfr = To_tensor()
        i_s = io.imread(i_s)
        if len(i_s.shape) == 2 or i_s.shape[2] == 1:
            i_s = np.repeat(i_s[:, :, np.newaxis], 3, axis=2)
        else:
            i_s = i_s[:, :, :3]
        orig_i_s_size = (i_s.shape[1], i_s.shape[0])
        i_s = cv2.resize(i_s, size)

        i_t = io.imread(i_t)
        i_t = cv2.resize(i_t, size)
        
        i_t, i_s = tmfr([i_t, i_s])
        i_t = i_t.unsqueeze(0).to(device)
        i_s = i_s.unsqueeze(0).to(device)

        with torch.no_grad():
            o_sk, o_t, o_f = model(i_t, i_s, (i_t.shape[2], i_t.shape[3]))

        o_f = o_f.squeeze(0).detach().cpu().permute(1, 2, 0).numpy()
        o_f = 127.5 * o_f + 127.5
        o_f = o_f.astype('uint8')
        o_f = cv2.resize(o_f, orig_i_s_size)

        o_t = o_t.squeeze(0).detach().cpu().permute(1, 2, 0).numpy()
        o_t = 127.5 * o_t + 127.5
        o_t = o_t.astype('uint8')
        o_t = cv2.resize(o_t, orig_i_s_size)
        o_t = cv2.cvtColor(o_t, cv2.COLOR_BGR2GRAY)
        _, o_t = cv2.threshold(o_t, 125, 255, cv2.THRESH_BINARY)

        o_sk = o_sk.squeeze(0).detach().cpu().permute(1, 2, 0).numpy()
        o_sk = (255.0 * o_sk).astype('uint8')
        o_sk = cv2.resize(o_sk, orig_i_s_size)

        # 저장 시 에러 추적이 가능하도록 try 추가
        try:
            plt.imsave(path, o_f)
        except Exception as e:
            print(f"[❌ ERROR] Failed to save {path}: {e}")

    SAVE_PATH = os.getenv('SAVE_PATH')
    save_dir = f'{SAVE_PATH}/o_t'
    os.makedirs(save_dir, exist_ok=True)

    for img_name in tqdm(os.listdir(f'{SAVE_PATH}/i_s'), desc="samples processed"):
        idx = img_name.split('.')[0]
        i_s_path = os.path.join(f'{SAVE_PATH}/i_s', f'{idx}.png')
        i_t_path = os.path.join(f'{SAVE_PATH}/tmp/i_t', f'{idx}.png')
        out_path_1 = os.path.join(save_dir, f'{idx}.png')
        try:
            infer(i_s_path, i_t_path, (128, 64), G, out_path_1)
        except Exception as e:
            print(f"[❌ ERROR] {idx} failed to generate: {e}")



def blend_o_t_bg():
    SAVE_PATH = os.getenv('SAVE_PATH')
    def create_final_image(txt_img, bg_img):
        h, w, _ = bg_img.shape
        txt_img = cv2.resize(txt_img, (w,h))
        gray_img = cv2.cvtColor(txt_img, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        corner_pixel = mask[0,0]
        if corner_pixel == 255:
            mask = cv2.bitwise_not(mask)
        radius = 1

        blurred_mask = cv2.GaussianBlur(mask, (radius*2+1, radius*2+1), 0)
        blurred_mask_float = blurred_mask.astype(np.float32) / 255.0
        txt_img_float = txt_img.astype(np.float32)
        bg_img_float = bg_img.astype(np.float32)
        blurred_mask_3c = cv2.merge([blurred_mask_float, blurred_mask_float, blurred_mask_float])
        composite = (txt_img_float * blurred_mask_3c) + (bg_img_float * (1 - blurred_mask_3c))
        composite = np.uint8(composite)
        return composite

    o_t_path = f'{SAVE_PATH}/o_t'
    bg_path = f'{SAVE_PATH}/bg'
    o_f_path = f'{SAVE_PATH}/o_f'
    os.makedirs(o_f_path, exist_ok=True)
    img_ids = os.listdir(o_t_path)
    for img_id in img_ids:
        try:
            o_t_img = cv2.imread(os.path.join(o_t_path, img_id))
            bg_img = cv2.imread(os.path.join(bg_path, img_id))
            
            img = create_final_image(o_t_img, bg_img)
            save_path = os.path.join(o_f_path, img_id)
            cv2.imwrite(save_path, img)
        except:
            print(img_id)


def create_final_images():
    SAVE_PATH = os.getenv('SAVE_PATH')
    img2info = json.load(open(f"{SAVE_PATH}/para_info.json", "r"))
    imgs = os.listdir(f"{SAVE_PATH}/output_base")
    id2img = {}
    for img in imgs:
        id2img[img.split(".")[0]] = img

    for img_id in img2info.keys():
        try:
            img = Image.open(f"{SAVE_PATH}/output_base/"+id2img[img_id.split("_")[0]])
            img_crop = Image.open(f"{SAVE_PATH}/o_f/{img_id}.png")
            x1, y1, _, _ = img2info[img_id]['bbox']
            img.paste(img_crop, (x1, y1))
            img.save(f"{SAVE_PATH}/output_base/"+id2img[img_id.split("_")[0]])
        except:
            print("failed", img_id)

    os.system(f"mv {SAVE_PATH}/output_base {SAVE_PATH}/output")
