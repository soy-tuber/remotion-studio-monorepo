import json
import os
from gtts import gTTS

def generate_audio():
    # Assuming running from apps/remotion or adjusting paths relative to script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir) # apps/remotion
    
    json_path = os.path.join(project_root, 'public', 'data2.json')
    output_dir = os.path.join(project_root, 'public', 'audio')
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    scenes = data.get('scenes', [])
    
    for i, scene in enumerate(scenes):
        script = scene.get('script', '')
        if script:
            print(f"Generating audio for scene {i}...")
            tts = gTTS(script, lang='ja')
            output_path = os.path.join(output_dir, f"scene_{i}.mp3")
            tts.save(output_path)
            print(f"Saved to {output_path}")

if __name__ == "__main__":
    generate_audio()
