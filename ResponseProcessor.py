from gensim.models.doc2vec import TaggedDocument

class ResponseProcessor:
    def __init__(self, responses = None):
        if not responses:
            raise ValueError("Responses array is Empty")
        else:
            self.responses = responses

        self.make_chunks()
    
    def make_chunks(self):
        pass

    def get_chunks(self):
        pass
