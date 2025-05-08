import gensim
from gensim.models.doc2vec import TaggedDocument
import gensim.downloader as api
from sklearn.metrics.pairwise import cosine_similarity


class SimilarityModel:
    def __init__(self, training_documents=None):
        if training_documents:
            self.training_data = training_documents
        else:
            # default to text8 dataset
            self.set_train_data_text8()
        
        self.init_model()
        # self.train()


    def set_train_data_text8(self):
        dataset = api.load("text8")
        data = [i for i in dataset]
        # convert the text8 dataset to tagged documents
        def tagged_document(list_of_list_of_words):
            for i, list_of_words in enumerate(list_of_list_of_words):
                # use documents index as the tag
                yield gensim.models.doc2vec.TaggedDocument(words = list_of_words, tags = [i])

        self.training_data = list(tagged_document(data)) # list of TaggedDocument objects


    def init_model(self, vector_size=50, window=2, min_count=1, workers=4, epochs=20):
        # Initialize the Doc2Vec model
        self.model = gensim.models.Doc2Vec(vector_size=vector_size,  # Dimensionality of the document vectors
                                           window=window,         # Maximum distance between the current and predicted word within a sentence
                                           min_count=min_count,      # Ignores all words with total frequency lower than this
                                           workers=workers,        # Number of CPU cores to use for training
                                           epochs=epochs)        # Number of training epochs   

        # build the vocabulary from the training data
        self.model.build_vocab(self.training_data)
        print("Vocabulary built.")


    def train(self):
        self.model.train(self.training_data, total_examples=self.model.corpus_count, epochs=self.model.epochs)
        print("Model trained.")


    def get_similarity(self, response1: TaggedDocument, response2:TaggedDocument):
        # Infer vectors for the documents
        vector1 = self.model.infer_vector(response1.words)
        vector2 = self.model.infer_vector(response2.words)

        # Calculate cosine similarity
        similarity = cosine_similarity([vector1], [vector2])[0][0]
        return similarity
    
    def get_training_data(self):
        return self.training_data