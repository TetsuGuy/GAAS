import random

# Main prompt string

# List of possible modifications (existing strings)
prompts = [
    "A image of a young woman with a dark goth aesthetic. She wears a black top and fishnet tights with holes, a black short skirt, black leather shoes with thick soles. Her makeup is bold, with dark lipstick and heavy eyeliner. The angle is a wide shot.",
    "woman wearing a grey pullover with a black mini skirt. She has black hair with purple strands. Her makeup is bold with a black lipstick and heavy eyeliner. The angle is a close image of her upper body. Her facial expression is cheerful.",
    "woman walking in a mall with black heavy boots with thick soles, fishnet tights, a skirt black that reads 'Goth IHOP' in blue font, a black top and black leather collar. Her hair is black and tied into a pony tail.  Her make is bold with a black lipstick and heavy eyeliner.",
    "She has black hair with purple strands.",
    "woman crossing the street. She is wearing black boots, black stockings, a short skirt, a puffy grey jacket and a leather backpack. Her hair is black with green strands.  Her make is bold with a black lipstick and heavy eyeliner. her back is facing the camera and she is looking over her shoulder into the camera.",
    "woman standing with her back to the camera looking over the shoulder into the camera. she is wearing a black dress, a black corset and black sleeves.  Her make is bold with a black lipstick and heavy eyeliner. Her hair is black with purple strands",
    "A image of a young woman with a dark goth aesthetic. Her back is to the camera. She is looking over her shoulder into the camera. Pressing her Buttocks prominent in the foreground.She wears a black top, black ripped fishnet tights, a black mini-skirt, black leather shoes with thick soles.Her makeup is bold, with dark lipstick and heavy eyeliner. The angle is a wide shot",
    "woman wearing a black crop top with a black short skirt, heavy black leather boots with thick soles, black tights. She has black hair with green strands. Her makeup is bold with a black lipstick and heavy eyeliner. The angle is a wide shot.",
    "a women with a baggy grey pullover and black thigh high stockings standing in front of a mirror holding a cell phone. She has black and white hair. The background is a living room. The angle is wide. She has a large chest and a wide wiast."
]
    


# Randomize the modification process (inject or append strings)
def randomize_prompt():
    return prompts[random.randint(0, len(prompts) - 1)]

