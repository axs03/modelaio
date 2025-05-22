from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
from sklearn.metrics.pairwise import cosine_similarity

class SimilarityModel:
    def __init__(self):
        # Load model from HuggingFace Hub
        self.tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
        self.model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
        print("Model loaded successfully")

    # Mean Pooling - Take attention mask into account for correct averaging ; give the sentence embeddings
    def mean_pooling(self, model_output, attention_mask):
        token_embeddings = model_output[0] # First element of model_output contains all token embeddings
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)


    def get_cosine_similarity(self, **responses):
        # Convert keyword arguments to a list of sentences
        sentences = list(responses.values())

        if len(sentences) < 2:
            raise ValueError("At least two sentences are required to compute cosine similarity.")

        # Tokenize sentences
        encoded_input = self.tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')

        # Compute token embeddings
        with torch.no_grad():
            model_output = self.model(**encoded_input)

        # Perform pooling
        sentence_embeddings = self.mean_pooling(model_output, encoded_input['attention_mask'])

        # Normalize embeddings
        sentence_embeddings = F.normalize(sentence_embeddings, p=2, dim=1)

        # Compute cosine similarity
        sentence_embeddings_np = sentence_embeddings.cpu().numpy()
        cosine_similarities = cosine_similarity(sentence_embeddings_np)
        print("Cosine similarities:")
        print(cosine_similarities[0][1]) # shape is 2,2
