import random

def generate_random_floats(n):
    # Generate n random floats that sum to <= 1, with two decimal points
    floats = []
    
    for i in range(n):
        value = round(random.uniform(10, 100) / 100, 2)
        
        floats.append(value)
    
    return floats
