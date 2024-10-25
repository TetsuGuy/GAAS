import os
import torch
from diffusers import FluxPipeline
from huggingface_hub import login
from accelerate import Accelerator
from random import randint
from time import time

# Set the environment variable for PyTorch memory management
os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'expandable_segments:True'

# Log in to Hugging Face
# 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
login("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")

# Define your prompt
prompt = """A image of a young woman with a dark goth aesthetic.
She wears a black top, black ripped fishnet tights, a black mini-skirt, black leather shoes with thick soles.
Her makeup is bold, with dark lipstick and heavy eyeliner. The angle is a wide shot."""
# Load the model and move it to GPU
torch.cuda.empty_cache() # empty the cache
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-dev", torch_dtype=torch.bfloat16)
pipe.enable_sequential_cpu_offload()
pipe.vae.enable_slicing()
pipe.vae.enable_tiling()
pipe.load_lora_weights("Mutli/gothgirlflux", weight_name="ravengriim13.safetensors", adapter_name="ravengriim")
pipe.load_lora_weights("Mutli/gothgirlflux", weight_name="swaggy16.safetensors", adapter_name="swaggy")
pipe.set_adapters(["ravengriim", "swaggy"], adapter_weights=[1, 1])

accelerator = Accelerator()
pipe = accelerator.prepare(pipe)

num_images = 1
output_dir = "generated_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Generate an image
for i in range(num_images):
    start_time = time()
    output = pipe(
        prompt, # The text that describes the image you want
        height=1152,
        width=896, # These define the size (in pixels) of the generated image
        guidance_scale=7.5, # This controls how much the model should adhere to the prompt. A higher value (usually between 7.5 and 15) will make the model more faithful to the prompt, while a lower value allows for more creativity
        num_inference_steps=20, # This defines how many steps the model takes during the image generation process. More steps typically result in better quality, but it takes longer
        max_sequence_length=512, # This sets the maximum sequence length for the model’s input prompt
        generator=torch.Generator("cpu").manual_seed(0)
    )
    end_time = time()
    image = output.images[0]  # Access the first image from the output

    # Save the image with a numbered filename
    time_for_image = end_time - start_time
    image_path = os.path.join(output_dir, f"image_{i+1}.png")
    image.save(image_path)
    print(f"Image took {time_for_image}")
    print(f"Image {i+1} generated and saved as {image_path}")
