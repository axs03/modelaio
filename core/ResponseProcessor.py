from gensim.models.doc2vec import TaggedDocument
import re
import os

class ResponseProcessor:
    def __init__(self, file_paths = list()):
        self.file_paths = file_paths
        self.responses = dict()

        self.read_files()
        self.make_chunks()

        
    def clean_file_path(self, file_path):
        name = os.path.basename(file_path)
        stem, _ = os.path.splitext(name) # _ = extension
        return stem


    def read_files(self):
        for file_path in self.file_paths:
            with open(file_path, "r") as file:
                response = file.read()
                key = self.clean_file_path(file_path)
                self.responses[key] = response
    

    def make_chunks(self):
        response_chunks = dict() # contains the mapped chunks for each response file
        for key, response in self.responses.items():
            headers = re.findall(r"^[*]{2}[a-zA-Z0-9]*[**]{2}$", response, re.MULTILINE) # get all markdown headers
            stripped_headers = [header.strip("*") for header in headers] # remove the markdown stars
            if not stripped_headers:
                print (f"No headers found in {key}")
                continue # skip file

            paragraphs = re.split(r"[*]{2}[a-zA-Z0-9]*[**]{2}", response, re.MULTILINE)[1:] # remove false first element
            
            mapped_paragraphs = zip(stripped_headers, paragraphs, strict=True)
            response_chunks[key] = mapped_paragraphs
            
        return response_chunks


    # pretty print the chunks
    def get_chunks(self):
        for key, val in self.make_chunks().items():
            print(f"File: {key}")
            for i in val:
                print(f"Header: {i[0]}")
                print(f"Paragraph: {i[1]}")
                print("" + "-"*10)
            print("" + "-"*40)


    def vectorize_chunks(self):
        # create tagged documents from chunks in response processor
        documents = [
            TaggedDocument(words=chunk[1].split(), tags=[f"{key}_{chunk[0]}"]) 
            for key, chunks in self.make_chunks().items() 
            for chunk in chunks
        ]
        return documents

