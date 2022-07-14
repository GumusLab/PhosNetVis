import argparse
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--input",type = str ,required=True,help="input name")
args = vars(ap.parse_args())

myFile = open(args["input"],"r")
myFile.readline()
nodes = []
links = [] 

for line in myFile.readlines():
    line = (line.strip()).split(",")
    source = line[0]
    target = line[1]
    if source not in nodes:
        nodes.append(source)
    if target not in nodes:
        nodes.append(target)
    links.append((source,target))

filename = "json/"+args["input"][:-4]+"_network.txt"

f = open(filename,"w")

f.write(("var "+args["input"][:-4]+"_network = "+'{\n"nodes": [\n'))

for node in nodes:
    if nodes.index(node) != len(nodes)-1:
        f.write(('{"id": "'+node+'"},\n'))
    else:
        f.write(('{"id": "'+node+'"}\n'))

f.write('],\n "links": [\n')

for tuple in links:
    if links.index(tuple) != len(links)-1:
        f.write(('{"source": "'+tuple[0]+'", "target": "'+tuple[1]+'"},\n'))
    else:
         f.write(('{"source": "'+tuple[0]+'", "target": "'+tuple[1]+'"}\n'))

f.write('  ]\n}\n\n')

f.close()