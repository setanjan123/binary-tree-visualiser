import * as d3 from 'd3';
import './styles.css';

class Node {
    constructor(val) {
        this.name = val;
        this.children = [];
    }
}

const buildTreeObject = (node, i,length,arr) => {
    if (i < length) {
        node = new Node(arr[i]);
        let left = buildTreeObject(node.left, 2 * i + 1,length,arr);
        let right = buildTreeObject(node.right, 2 * i + 2,length,arr);
        if(left) node.children[0] = left;
        if(right) node.children[1] = right;
        if(node.children.length>0) {
            if(!node.children[0]) node.children[0] = new Node('null');
            else if(!node.children[1]) node.children[1] = new Node('null');
        }
    }
    return node;
}

function buildTree(arrString) {
    const arr = arrString.replace(/^\[|\]$/g, '').split(',');
    const length = arr.length;
    let root = buildTreeObject(null, 0,length,arr);
    return root;
}

const drawTree = ()=> {
    const treeData = buildTree(document.getElementById('array').value); 
    const margin = { top: 40, right: 90, bottom: 50, left: 90 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    d3.select('svg').selectAll('*').remove();
    const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const treeLayout = d3.tree().size([width, height]);

    const root = d3.hierarchy(treeData);

    treeLayout(root);

    const nodes = root.descendants();
    const links = root.links();

    const link = svg.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y));

    const node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
    
    node.append("circle")
        .attr("r", 20)
        .style("fill", d => {
            if(d.data.name=='null') return "grey";
            if(!d.parent) return "steelblue";
            if(d.parent.data.children[0]===d.data) return "red";
            return "green";
    })

    node.append("text")
    .attr("dy", ".35em")
    .attr("y", 0)
    .style("text-anchor", "middle")
    .text(d => d.data.name);
}

window.drawTree = drawTree;
