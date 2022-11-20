
import argparse
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--input",type = str ,required=True,help="input name")
args = vars(ap.parse_args())

file = open(args["input"],"r")
file.readline()

nodes = {}
links = {}

for line in file.readlines():
    line = (line.strip()).split(",")
    kinaseID = line[0]
    kinaseSize = line[1]
    edgeColor = line[2]
    edgeWeight = line[3]
    targetID = line[4]
    targetSize = line[5]
    phosphoSiteID = line[6]
    proteinPhosphorylation = line[7]

    if kinaseID not in nodes:
        nodes[kinaseID] = {"type":1, "nodeSize":kinaseSize, "nodeColors":[], "partitionIDs":[]}
    else:
        nodes[kinaseID]["type"] = 1
    
    if targetID not in nodes:
        nodes[targetID] = {"type":2, "nodeSize":targetSize, "nodeColors":[proteinPhosphorylation], "partitionIDs":[phosphoSiteID]}
    elif phosphoSiteID not in nodes[targetID]["partitionIDs"]:
        nodes[targetID]["nodeColors"].append(proteinPhosphorylation)
        nodes[targetID]["partitionIDs"].append(phosphoSiteID)

    if (kinaseID+targetID) not in links:
        curvature = -1
        if kinaseID == targetID:
            curvature = 0.4
        else:
            curvature = 0
        links[kinaseID+targetID] = {"source":kinaseID, "target": targetID, "edgeColor":edgeColor, "edgeWeight":edgeWeight,"curvature":curvature}

f = open("toy-networks.js","w")
f.write(("var toy_network = "+'{\n"nodes": [\n'))

totalNodeNum = len(nodes.values())
count = 0
for id, node in nodes.items():
    count += 1

    nodeColors = node["nodeColors"]
    partitionIDs = node["partitionIDs"]

    if len(partitionIDs) == 0:
        partitionText = ""
    else:
        partitionText = '"'+('" , "'.join(partitionIDs)).strip() + '"'
    if count<totalNodeNum:
        f.write(('{"id": "' + id + '", "type":'+ str(node["type"])+ ', "nodeSize": '+ str(node["nodeSize"])+ ', "nodeColors": ['+ ",".join([str(i) for i in nodeColors])+']'+', "partitionIDs":['+ partitionText +']' +'},\n'))
    else:
        f.write(('{"id": "' + id + '", "type":'+ str(node["type"])+ ', "nodeSize": '+ str(node["nodeSize"])+ ', "nodeColors": ['+ ",".join([str(i) for i in nodeColors])+']'+', "partitionIDs":['+ partitionText +']' +'} \n'))
f.write('],\n"links": [\n')


totalLinkNum = len(links.values())
count = 0
for link in links.values():
    count += 1
    if count<totalLinkNum:
        f.write(('{"source": "'+link["source"]+'", "target": "'+link["target"]+'", "edgeWeight": '+ str(link["edgeWeight"]) +', "edgeColor":'+ str(link["edgeColor"])+', "curvature":'+ str(link["curvature"])+'},\n'))
    else:
        f.write(('{"source": "'+link["source"]+'", "target": "'+link["target"]+'", "edgeWeight": '+ str(link["edgeWeight"]) +', "edgeColor":'+ str(link["edgeColor"])+', "curvature":'+ str(link["curvature"])+'}\n'))
f.write('  ]\n}\n\n')

f.close()