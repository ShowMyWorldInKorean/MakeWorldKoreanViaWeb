import os
import time

WATCH_DIR = "/data/indictrans_output"

def translate_text(text):
    # 실제 IndicTrans 모델로 바꿔야 함
    return f"{text} [translated]"

def process_loop():
    print("[🔁 IndicTrans 루프 시작]")
    while True:
        for file in os.listdir(WATCH_DIR):
            if file.endswith(".txt") and not file.startswith("output_"):
                input_path = os.path.join(WATCH_DIR, file)
                output_path = os.path.join(WATCH_DIR, file)  # 덮어쓰기

                with open(input_path, "r", encoding="utf-8") as f:
                    src = f.read().strip()

                translated = translate_text(src)

                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(translated)

        time.sleep(0.5)
