import os
import torch
from diffusers import FluxPipeline
from huggingface_hub import login

# Set the environment variable for PyTorch memory management
os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'expandable_segments:True'

# Log in to Hugging Face
# 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
login("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")

# Load the model and move it to GPU
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-dev", torch_dtype=torch.float16)
pipe.enable_model_cpu_offload() #save some VRAM by offloading the model to CPU. Remove this if you have enough GPU power

# Define your prompt
prompt = "A girl dressed in gothic clothes"

# Generate an image
# guidance_scale (between 7.5 and 15) the higher the less creativity the more accurate to prompt
# seed value to reproduce results

output = pipe(
    prompt, # The text that describes the image you want
    height=256,
    width=256, # These define the size (in pixels) of the generated image
    guidance_scale=3.5, # This controls how much the model should adhere to the prompt. A higher value (usually between 7.5 and 15) will make the model more faithful to the prompt, while a lower value allows for more creativity
    num_inference_steps=10, # This defines how many steps the model takes during the image generation process. More steps typically result in better quality, but it takes longer
    max_sequence_length=512, # his sets the maximum sequence length for the model’s input prompt
    generator=torch.Generator("cpu").manual_seed(0)
)
image = output.images[0]  # Access the first image from the output

# Save the image
image.save("test_image.png")
print("Image generated and saved.")
