import sys
import re
import json

vertices = []

regex_v = re.compile("v\s")
regex_float = re.compile("\s(\d?\d)+\.(\d?\d)+\s");

def openfile(model_name):
    try:
        f = open('../models/'+ model_name, 'r')
        extract_vertices(model_name, f)
    except IOError:
        print(sys.exc_info()[0])
        print(sys.exc_info()[1])

def extract_vertices(model_name, f):
    for line in f:

        if(regex_v.match(line)):
            it = re.finditer(regex_float, line)
            vector = {}
            index = 1
            for match in it:
                vector["v_" + str(index)] = float(match.group(0))
                #print("index : " + str(index) + " ")
                index += 1
            vertices.insert(0,vector)

    #print(vertices)
    dump_json(model_name)


def dump_json(model_name):
    fp = open('../models/'+ model_name + '.json', 'w')
    print(vertices)
    json.dump(vertices, fp)

openfile(sys.argv[1])
