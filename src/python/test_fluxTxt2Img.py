import pytest
from unittest.mock import patch, MagicMock
import torch
import os
import random
import time
from fluxTxt2Img import FluxPipeline, randomize_prompt

# test_fluxTxt2Img.py

@patch("fluxTxt2Img.login")
@patch("fluxTxt2Img.randomize_prompt")
@patch("fluxTxt2Img.FlowMatchEulerDiscreteScheduler.from_pretrained")
@patch("fluxTxt2Img.CLIPTextModel.from_pretrained")
@patch("fluxTxt2Img.CLIPTokenizer.from_pretrained")
@patch("fluxTxt2Img.T5EncoderModel.from_pretrained")
@patch("fluxTxt2Img.T5TokenizerFast.from_pretrained")
@patch("fluxTxt2Img.AutoencoderKL.from_pretrained")
@patch("fluxTxt2Img.FluxTransformer2DModel.from_pretrained")
@patch("fluxTxt2Img.FluxPipeline.load_lora_weights")
@patch("fluxTxt2Img.FluxPipeline.set_adapters")
def test_fluxTxt2Img(
  mock_set_adapters,
  mock_load_lora_weights,
  mock_transformer,
  mock_vae,
  mock_tokenizer_2,
  mock_text_encoder_2,
  mock_tokenizer,
  mock_text_encoder,
  mock_scheduler,
  mock_randomize_prompt,
  mock_login
):
  # Mock return values
  mock_login.return_value = None
  mock_randomize_prompt.return_value = "test prompt"
  mock_scheduler.return_value = MagicMock()
  mock_text_encoder.return_value = MagicMock()
  mock_tokenizer.return_value = MagicMock()
  mock_text_encoder_2.return_value = MagicMock()
  mock_tokenizer_2.return_value = MagicMock()
  mock_vae.return_value = MagicMock()
  mock_transformer.return_value = MagicMock()
  mock_load_lora_weights.return_value = None
  mock_set_adapters.return_value = None

  # Mock the FluxPipeline
  mock_pipeline = MagicMock()
  mock_pipeline.return_value = mock_pipeline
  mock_pipeline.images = [MagicMock()]

  with patch("fluxTxt2Img.FluxPipeline", return_value=mock_pipeline):
    import fluxTxt2Img  # Re-import to apply mocks

    # Check if the pipeline is created correctly
    assert isinstance(fluxTxt2Img.pipe, FluxPipeline)

    # Check if the image generation process works
    start_time = time.time()
    image = fluxTxt2Img.pipe(
      prompt="test prompt",
      width=256,
      height=256,
      guidance_scale=2,
      num_inference_steps=5,
      generator=torch.Generator("cpu").manual_seed(1234)
    ).images[0]
    end_time = time.time()
    generation_time = end_time - start_time

    assert image is not None
    assert generation_time > 0

    # Check if the image is saved correctly
    save_path = os.path.join(os.path.dirname(__file__), f"..\\nodejs\\src\\image-provider\\IMG.png")
    image.save.assert_called_once_with(save_path)