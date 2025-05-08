# using DBOW : distributed bag of words
# compare using doc2vec model
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from sklearn.metrics.pairwise import cosine_similarity
from SimilarityModel import SimilarityModel

# file handling
# file_1 = open("tests/resp_chgpt.txt", "r")
# file_2 = open("tests/resp_dpsk.txt", "r")
# gpt_response = file_1.read()
# dpsk_response = file_2.read()

string1 = "The quick brown fox jumps over the lazy dog."
string2 = "The quick brown fox jumps over the lazy dog."

# can use an array of tagged docs called documents = [] to train the model
# to process chunks, we can make each chunk a tagged document

# will test the cosine similarity of two strings
string1doc = TaggedDocument(words=string1.split(), tags=[])
string2doc = TaggedDocument(words=string2.split(), tags=[])

# create similarity model
similarity_model = SimilarityModel()
print(similarity_model.get_training_data())
# cosine = similarity_model.get_similarity(string1doc, string2doc)
# print(cosine)

