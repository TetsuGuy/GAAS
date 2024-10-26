import random

def generate_random_floats(n):
    # Generate n random floats that sum to <= 1, with two decimal points
    remaining = 1.0  # Start with the total sum limit of 1
    floats = []
    
    for i in range(n):
        # The last float gets whatever remains to ensure sum <= 1
        if i == n - 1:
            value = round(remaining, 2)
        else:
            # Generate a float between 0 and the remaining value, ensuring the sum doesn't exceed 1
            value = round(random.uniform(0, remaining), 2)
        
        floats.append(value)
        remaining -= value
        
        # Ensure remaining doesn't go below 0 due to rounding
        if remaining < 0:
            remaining = 0
    
    return floats

def filter_strings_based_on_floats(strings, floats):
    # Remove corresponding strings if float is 0
    for i in range(len(floats) - 1, -1, -1):  # Iterate backward to avoid index issues
        if floats[i] == 0:
            del strings[i]
    return strings

# Example usage
strings = ["bexicutes21", "ravengriim13", "swaggy16"]
floats = generate_random_floats(3)

# Remove strings where the corresponding float is 0
strings = filter_strings_based_on_floats(strings, floats)
