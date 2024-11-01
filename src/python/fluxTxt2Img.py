# revised script thanks to Brem-AI on reddit 🖤

import torch
from diffusers import FlowMatchEulerDiscreteScheduler, AutoencoderKL
from diffusers.models.transformers.transformer_flux import FluxTransformer2DModel
from diffusers.pipelines.flux.pipeline_flux import FluxPipeline
from transformers import CLIPTextModel, CLIPTokenizer,T5EncoderModel, T5TokenizerFast
from huggingface_hub import login
import time
import random
from promptGen import randomize_prompt
from generateLoraWithWeights import assignWeightToLora
from dotenv import load_dotenv
import os

load_dotenv()

# Login into Hugginface
huggingface_token = os.getenv("HUGGINGFACE_TOKEN")
login(huggingface_token) 

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
pipe.load_lora_weights("Mutli/GAAS", weight_name="bexicutes21.safetensors", adapter_name="bexicutes21")
pipe.load_lora_weights("Mutli/GAAS", weight_name="ravengriim13.safetensors", adapter_name="ravengriim13")
pipe.load_lora_weights("Mutli/GAAS", weight_name="swaggy16.safetensors", adapter_name="swaggy16")

loraTuple = assignWeightToLora()

loras = []
weights = []

for i in loraTuple:
    if loraTuple.index(i) % 2 == 0:
        loras.append(i)
    else:
        weights.append(i)

pipe.set_adapters(loras, adapter_weights=weights)

#############
# INFERENCE #
#############

# Settings
prompt          = randomize_prompt()
negative_prompt = "Watermark, Text, censored, deformed, bad anatomy, disfigured, poorly drawn face, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, disconnected head, malformed hands, long neck, mutated hands and fingers, bad hands, missing fingers, cropped, worst quality, low quality, mutation, poorly drawn, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, missing fingers, fused fingers, abnormal eye proportion, Abnormal hands, abnormal legs, abnormal feet,  abnormal fingers"
width           = 1080
height          = 1920 # standard full HD height and width generating a 9:16 image (portrait mode)
guidance        = round(random.uniform(0, 15), 1) # results in the best images so far..
steps           = 20 # 20 is enough for now
seed            = random.randint(0,9999999999) # random seed from 0 to 9999999999
print(f"Generated seed: {seed}")
# Generation
image = pipe(
  prompt=prompt,
  width=width,
  height=height,
  guidance_scale=guidance,
  num_inference_steps=steps,
  generator=torch.Generator("cpu").manual_seed(seed)
).images[0]
save_path = os.path.join(os.path.dirname(__file__), f"..\\nodejs\\src\\image-provider\\_{seed}_IMG.png")
image.save(save_path)