var animationIndex = -1
var animationActive = false
var animationData = {};
var clickedNode = null

function createNodeAnimation(node){
  var newNode = animationData[node.id]
  var node_size = newNode.nodeSize
  if(node_size === undefined){
    node_size = 1
  }
  else{
    node_size = normalized(node_size,nodeSizeRange,[0,1]) + 0.5
  }

  // NODE PARTITIONS
  var num_sites = (newNode.nodeColors).length
  if (num_sites > 1 && (PARAMS.Phosphorylation === "Show" || searchNodes.has(node))) { // partitions
    verticalPartitions = num_sites
  }
  else {
    verticalPartitions = 1
  }
    
  if(newNode.type === 1){ // if it is a kinase
    radialPartitions = 25

    if (searchNodes.has(node) || PARAMS.Labels === "On"){
    var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(node_size*0.001, node_size*8, node_size*9*verticalPartitions, radialPartitions, verticalPartitions),
    new THREE.MeshLambertMaterial({
      transparent: false,
      depthWrite: false,
      opacity: 1,
      wireframe: false,
      emissive: "#181818",
      vertexColors: THREE.FaceColors,
    }));

    }
    else{
    var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(node_size*0.001, node_size*8, node_size*9*verticalPartitions, radialPartitions, verticalPartitions),
    new THREE.MeshLambertMaterial({
      transparent: false,
      depthWrite: true,
      opacity: 1,
      wireframe: false,
      emissive: "#181818",
      vertexColors: THREE.FaceColors,
    }));
    }

  }

  else{ // if it is not a kinase
    radialPartitions = 25
    if (searchNodes.has(node) || PARAMS.Labels === "On"){
    var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(node_size*8, node_size*8, node_size*6*verticalPartitions, radialPartitions, verticalPartitions),
    new THREE.MeshLambertMaterial({
      transparent: false,
      depthWrite: false,
      opacity: 1,
      wireframe: false,
      emissive: "#181818",
      vertexColors: THREE.FaceColors,
    }));
    }
    else{
    var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(node_size*8, node_size*8, node_size*6*verticalPartitions, radialPartitions, verticalPartitions),
    new THREE.MeshLambertMaterial({
      transparent: false,
      depthWrite: true,
      opacity: 1,
      wireframe: false,
      emissive: "#181818",
      vertexColors: THREE.FaceColors,
    }));
    }

  }

  // NODE COLORING
  if(verticalPartitions === 1){ // NO PARTITIONS!

    if(PARAMS.Phosphorylation === "Hide"){ // we are in phos hide mode
      if(searchNodes.has(node)){
        nodeColor =  newNode.nodeColors.length > 0 ? newNode.nodeColors[0] : null
      }
      else{
        nodeColor = newNode.type === 1 ? "kinase" : "null"
      }
    }
    else{ // we are in phos show mode
      nodeColor =  newNode.nodeColors.length > 0 ? newNode.nodeColors[0] : null
    }

    let face = 0
    for(face = 0; face<50;face++){
      mesh.geometry.faces[face].color.setHex(nodeColoring(nodeColor))
    }
  
    face = 50
    for(face = 50; face<75;face++){
      mesh.geometry.faces[face].color.setHex("0xb5b5b5");
    }

    face = 75
    for(face = 75; face<100;face++){
      if(PARAMS.Phosphorylation === "Hide" && newNode.type === 1 && !searchNodes.has(node)){mesh.geometry.faces[face].color.setHex("0xc78b32");}
      else{mesh.geometry.faces[face].color.setHex("0xb5b5b5");}
    }
  }
  else{ // THERE ARE PARTITIONS!

    for (let i = 0; i < radialPartitions*2*(verticalPartitions); i+= (verticalPartitions*2))
    {
          j = 0
          for (let k = 0; k<newNode.nodeColors.length; k++) {
            nodeColor = newNode.nodeColors[k]
            mesh.geometry.faces[i+(j*2)].color.setHex(nodeColoring(nodeColor)); 
            mesh.geometry.faces[i+(j*2)+1].color.setHex(nodeColoring(nodeColor));
            let x = 0
            for(x = i+(j*2)+2;x<i+(j*2)+27;x++){
              mesh.geometry.faces[x].color.setHex("0xb5b5b5");                  
            }
            for(x = i+(j*2)+27;x<i+(j*2)+52;x++){
              mesh.geometry.faces[x].color.setHex("0xb5b5b5");                  
            }
            j = j + 1
            }
    }
  }

  if (searchNodes.has(node) || PARAMS.Labels === "On"){
  const sprite = new SpriteText(node.id);
  sprite.color = 'rgb(0,0,0)';
  sprite.textHeight = 7;
  sprite.fontFace = "CenturyGothicPro-Bold"
  mesh.add(sprite);
  }
  if (node.id == clickedNode){
    addRows(newNode.partitionIDs, newNode.nodeColors, newNode.pValues)
  }
  return mesh

}

function linkColorAnimation(link){
    var newLink = animationData[link.source.id+link.target.id]
    if(newLink.edgeColor == undefined){
        return ("#cccccc")
    }
    return linkColoring(newLink.edgeColor, '2c8d5c', '97b8a0', 'd7d6d2', 'bc9bef', '743ed4');
}


function linkWidthAnimation(link){
    var newLink = animationData[link.source.id+link.target.id]
    if(edgeWeightRange[0]!= undefined && newLink.edgeWeight != undefined){
        return  normalized(newLink.edgeWeight, edgeWeightRange, [0,1])
    }
    return 0.8;
}