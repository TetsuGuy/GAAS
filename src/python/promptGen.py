import random
    
locations = [
    "on a street",
    "on graveyard",
    "in Haunted House",
    "in a dark alley",
    "in a dark room",
    "in a dark forest",
    "in a dark room",
    "in a dark house",
]

clothes = [
    "black gothic dress",
    "black top, black skirt, black boots",
    "black crop top, black skirt, black boots, fishnet tights",
    "baggy black pullover and black thigh high stockings",
    "grey pullover with a black mini skirt",
    "a black dress, a black corset and black sleeves",
]

makeup = [
    "bold with a black lipstick and heavy eyeliner",
]

hairs = [
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
]

camera_angles = [
    "wide shot",
    "close up of her upper body",
    "close up of her face",
    "far shot",
]
pose = [
    "standing",
    "sitting",
    "walking",
    "crossing the street",
    "looking over her shoulder into the camera",
    "with her back to the camera looking over the shoulder into the camera",
    "standing in front of a mirror holding a cell phone",
    "striking a pose for the camera",
]

styles = [
    "cinematic photo. 35mm photograph, film, bokeh, professional, 4k, highly detailed",
    "gothic style. dark, mysterious, haunting, dramatic, ornate, detailed",
    "detailed skin texture, subsurface scattering",
    "Photorealistic, Hyperdetailed, soft lighting, realistic, masterpiece, best quality, ultra realistic, 8k, golden ratio, Intricate, High Detail, soft focus",
    "HDR photo. High dynamic range, vivid, rich details, clear shadows and highlights, realistic, intense, enhanced contrast, highly detailed"
]

# Randomize the modification process (inject or append strings)
def randomize_prompt():
    location = random.choice(locations)
    clothing = random.choice(clothes)
    makeup_choice = random.choice(makeup)
    angle = random.choice(camera_angles)
    hair = random.choice(hairs)
    pose_choice = random.choice(pose)
    style = random.choice(styles)
    
    new_prompt = f"photo of a woman {pose_choice} {location}. She is wearing {clothing}. Her makeup is {makeup_choice}. She has {hair}. The angle is a {angle}."
    
    return new_prompt
