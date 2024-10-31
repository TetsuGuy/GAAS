import pytest
from promptGen import randomize_prompt

def test_randomize_prompt():
    prompt = randomize_prompt()
    
    # Check if the prompt is a string
    assert isinstance(prompt, str)
    
    # Check if the prompt contains elements from each list
    assert any(location in prompt for location in [
        "on a street",
        "on graveyard",
        "in Haunted House",
        "in a dark alley",
        "in a dark room",
        "in a dark forest",
        "in a dark house",
    ])
    
    assert any(clothing in prompt for clothing in [
        "black gothic dress",
        "black top, black skirt, black boots",
        "black crop top, black skirt, black boots, fishnet tights",
        "baggy black pullover and black thigh high stockings",
        "grey pullover with a black mini skirt. She has black hair with purple strands",
        "a black dress, a black corset and black sleeves",
    ])
    
    assert any(makeup_choice in prompt for makeup_choice in [
        "bold with a black lipstick and heavy eyeliner",
    ])
    
    assert any(hair in prompt for hair in [
        "black hair",
        "black hair with purple strands",
        "black hair with red strands",
        "black hair with green strands",
        "black hair with blue strands",
        "black hair with pink strands",
        "black hair with white strands",
        "black and white hair",
        "black and red hair",
        "black and orange hair",
    ])
    
    assert any(angle in prompt for angle in [
        "wide shot",
        "close up of her upper body",
        "close up of her face",
        "far shot",
    ])
    
    assert any(pose_choice in prompt for pose_choice in [
        "standing",
        "sitting",
        "walking",
        "crossing the street",
        "looking over her shoulder into the camera",
        "with her back to the camera looking over the shoulder into the camera",
        "standing in front of a mirror holding a cell phone",
        "striking a pose for the camera",
    ])
    
    assert any(style in prompt for style in [
        "cinematic photo. 35mm photograph, film, bokeh, professional, 4k, highly detailed",
        "gothic style. dark, mysterious, haunting, dramatic, ornate, detailed",
        "detailed skin texture, subsurface scattering",
        "Photorealistic, Hyperdetailed, soft lighting, realistic, masterpiece, best quality, ultra realistic, 8k, golden ratio, Intricate, High Detail, soft focus",
        "HDR photo. High dynamic range, vivid, rich details, clear shadows and highlights, realistic, intense, enhanced contrast, highly detailed",
    ])