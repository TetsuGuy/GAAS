# revised script thanks to Brem-AI on reddit 🖤

import torch
from diffusers import FlowMatchEulerDiscreteScheduler, AutoencoderKL
from diffusers.models.transformers.transformer_flux import FluxTransformer2DModel
from diffusers.pipelines.flux.pipeline_flux import FluxPipeline
from transformers import CLIPTextModel, CLIPTokenizer,T5EncoderModel, T5TokenizerFast
from huggingface_hub import login
import time

# Login into Hugginface
login("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") 

# Model data type
dtype = torch.bfloat16

##############
# LOAD MODEL #
##############

# Local Folders
bfl_dir = "black-forest-labs/FLUX.1-dev"

# Load model components
scheduler       = FlowMatchEulerDiscreteScheduler.from_pretrained(bfl_dir, subfolder="scheduler", torch_dtype=dtype)
text_encoder    = CLIPTextModel.from_pretrained(bfl_dir, subfolder="text_encoder", torch_dtype=dtype)
tokenizer       = CLIPTokenizer.from_pretrained(bfl_dir, subfolder="tokenizer", torch_dtype=dtype, clean_up_tokenization_spaces=True)
text_encoder_2  = T5EncoderModel.from_pretrained(bfl_dir, subfolder="text_encoder_2", torch_dtype=dtype)
tokenizer_2     = T5TokenizerFast.from_pretrained(bfl_dir, subfolder="tokenizer_2", torch_dtype=dtype, clean_up_tokenization_spaces=True)
vae             = AutoencoderKL.from_pretrained(bfl_dir, subfolder="vae", torch_dtype=dtype)

# Load model
transformer = FluxTransformer2DModel.from_pretrained(bfl_dir, subfolder="transformer", torch_dtype=dtype)

############
# PIPELINE #
############

# Create pipe
pipe = FluxPipeline(
  scheduler=scheduler,
  text_encoder=text_encoder,
  tokenizer=tokenizer,
  text_encoder_2=text_encoder_2,
  tokenizer_2=tokenizer_2,
  vae=vae,
  transformer=transformer
)
pipe.enable_sequential_cpu_offload()
pipe.vae.enable_slicing()
pipe.vae.enable_tiling()

# Load LoRA
pipe.load_lora_weights("D:/pinokio/api/stable-diffusion-webui-forge.git/app/models/Lora/bexicutes21.safetensors", adapter_name="bexicutes21")
pipe.set_adapters("bexicutes21", adapter_weights=0.75)

#############
# INFERENCE #
#############

# Settings
prompt    = "a women with fat cleavage and fat waist, black and white hair standing at a beach with a black bikini. Her body is turned to the side and she is facing off into the distance. the angel is wide. Tattoo that reads 'Mommy'."
width     = 1080
height    = 1920
guidance  = 0
steps     = 20
seed      = 2011152402

# Generation
start_time = time.time()
image = pipe(
  prompt=prompt,
  width=width,
  height=height,
  guidance_scale=guidance,
  num_inference_steps=steps,
  generator=torch.Generator("cpu").manual_seed(seed)
).images[0]
end_time = time.time()
generation_time = end_time - start_time
print(f"Generating image took: {generation_time} seconds")
image.save("image.png")