from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
from sklearn.metrics.pairwise import cosine_similarity

RED = "\033[91m"
GREEN = "\033[92m"
RESET = "\033[0m"

class SimilarityModel:
    STATUS = str("OK")
    def __init__(self):
        # Load model from HuggingFace Hub
        self.tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
        self.model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
        SimilarityModel.STATUS = "OK"

    # Mean Pooling - Take attention mask into account for correct averaging ; give the sentence embeddings
    def mean_pooling(self, model_output, attention_mask):
        try:
            token_embeddings = model_output[0] # First element of model_output contains all token embeddings
            input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
            return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)
        except Exception as e:
            SimilarityModel.STATUS = f"{RED}{e}{RESET}"
            raise ValueError(f"Error in mean pooling: {str(e)}")


    def get_cosine_similarity(self, sentence1, sentence2):
        if not sentence1 or not sentence2:
            SimilarityModel.STATUS = f"{RED}Both sentences are required to compute cosine similarity.{RESET}"
            raise ValueError("Both sentences are required to compute cosine similarity.")

        try:
            # Tokenize sentences
            encoded_input = self.tokenizer([sentence1, sentence2], padding=True, truncation=True, return_tensors='pt')

            # Compute token embeddings
            with torch.no_grad():
                model_output = self.model(**encoded_input)
        
        except Exception as e:
            SimilarityModel.STATUS = f"Error in encoding_input/computing token embeddings: \n{RED}{e}{RESET}"
            raise ValueError(f"Error in encoding_input/computing token embeddings: \n{str(e)}")


        try:
            # Perform pooling
            sentence_embeddings = self.mean_pooling(model_output, encoded_input['attention_mask'])

            # Normalize embeddings
            sentence_embeddings = F.normalize(sentence_embeddings, p=2, dim=1)

            # Compute cosine similarity
            sentence_embeddings_np = sentence_embeddings.cpu().numpy()
            cosine_similarities = cosine_similarity(sentence_embeddings_np)
            return cosine_similarities[0][1] # shape is 2,2
        
        except Exception as e:
            SimilarityModel.STATUS = f"Error in mean pooling/embedding normalization/cosine similarity computation: {RED}{e}{RESET}"
            raise ValueError(f"Error in mean pooling/embedding normalization/cosine similarity computation: {str(e)}")
