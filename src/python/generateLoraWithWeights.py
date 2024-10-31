import random


def assignWeightToLora():
    loras = ["bexicutes21", "ravengriim13", "swaggy16"]
    remaining_weight = 1.0
    weights_with_loras = ()
    for i in loras:
        random_weight = round(random.uniform(0, remaining_weight), 2)
        if random_weight > 0:
            weights_with_loras += (i, random_weight)
            remaining_weight -= random_weight

    return weights_with_loras
