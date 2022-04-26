const N = 6

class ClueParser {
   constructor(clues,solution = []){
     this.clues = new Array(...clues)
     this.board = new Board(clues,solution)
   }

   parseClues(){
     for (let i=0;i<this.clues.length;i++){
       if (i%6 == 5 && this.clues[i] == 1) this.clues[i+1] = 1
       if (i%6 == 5 && this.clues[i] == 6) this.clues[i+1] = 6
       switch(this.clues[i]){
       case 6:
         this.board.six(i);
         break;
       case 1:
        this.board.one(i);
        break;
      case 5:
        this.board.updateRanges(i,3);
        break;
      case 4:
        this.board.updateRanges(i,4);
        break;
      case 3:
        this.board.updateRanges(i,5);
        break;
      case 2:
        this.board.updateRanges(i,6);
        break;
      default:
       }
      }
   }

   findLowHangingFruit(){
     for(let i=0;i<this.board.columns.length;i++){
       for (let j=N;j>0;j--){
       let value = this.board.columns[i].findLowFruit(j)
        while(value){
        value = this.board.columns[i].findLowFruit(j)
        }
       }
     }
    for(let i=0;i<this.board.rows.length;i++){
      for (let j=N;j>0;j--){
        let value = this.board.rows[i].findLowFruit(j)
        while(value){
        value = this.board.rows[i].findLowFruit(j)
        }
      }
    }
  }
 }

function solvePuzzle(clues) {
  const parser = new ClueParser(clues)
  parser.board.init()
  parser.board.populateBoardWithClues()
  parser.parseClues()
  parser.findLowHangingFruit()
  
const rowSolutions = []
for(let i=0;i<6;i++) rowSolutions.push(parser.board.rows[i].findAllValidPaths("east"))

const filteredRowSolutions = []

for(let i=0;i<N;i++) {
  filteredRowSolutions.push([])
  const leftClue = parser.board.clueMap[18+i].val
  const rightClue = parser.board.clueMap[6+i].val
  if (leftClue == 0 && rightClue == 0) {rowSolutions[i].forEach(s => filteredRowSolutions[i].push(s))
  continue;
  }
  for (let j=0;j<rowSolutions[i].length;j++){
    let count = 1
    let currentView = rowSolutions[i][j][0]
    for (let k=1;k<rowSolutions[i][j].length;k++){
      if (rowSolutions[i][j][k] > currentView){
        currentView = rowSolutions[i][j][k]
        count++
      }
    }
    if (count == leftClue || leftClue == 0) {
        const arrayLength = N
        currentView = rowSolutions[i][j][arrayLength-1]
        count = 1
          for (let k=1;k<arrayLength;k++){
            if (rowSolutions[i][j][arrayLength-k-1]>currentView){
              currentView = rowSolutions[i][j][arrayLength-k-1]
              count++
            }
          }
        if (count == rightClue || rightClue == 0) filteredRowSolutions[i].push(rowSolutions[i][j])
      }
  }
}
const validBoards = []

function findValidBoards(){
  const recurseValidBoards = (array,index) => {
  if (index == 6) {
    if (array.length == 6) validBoards.push(array)
  return
  }
  for(let i=0;i<filteredRowSolutions[index].length;i++){
    if (array.length == 0 || array.every(r=>noClash(r,filteredRowSolutions[index][i]))){
      const recursed = new Array(...array, filteredRowSolutions[index][i])
      recurseValidBoards(recursed,index+1)
    }
    }
  }
  for (let i=0;i<filteredRowSolutions[0].length;i++){
    const array = new Array(filteredRowSolutions[0][i])
    recurseValidBoards(array,1)
  }
}
  
findValidBoards()

const answer = validBoards.filter(board => {
  let current
  let count
  for(let i=0;i<N;i++){
    count = 1
    const downClue = parser.board.clueMap[i].val
    const upClue = parser.board.clueMap[12+i].val
    if (downClue == 0 && upClue == 0) continue;
    current = board[0][i]
    for(let j=1;j<N;j++){
      if (current<board[j][i]){
        current = board[j][i]
        count++
      }
    }

  if (downClue == count || downClue == 0){
    count = 1
    current = board[N-1][i]
    for(let j=1;j<N;j++){
      if (current<board[N-j-1][i]){
        current = board[N-j-1][i]
        count++
      }
    }
    if (upClue == count || upClue == 0) continue;
  }
  return false
  }
  return true
})
  
  return answer[0]
}

function range(start, end) {
  return new Array(end - start + 1).fill(undefined).map((_, i) => i + start);
}

function getColumns(length) {
  const columns = []
  for (let i=0;i<length;i++) columns.push(new SkyscraperColumn())
  return columns
}

function getRows(length){
const rows = []
for (let i=0;i<length;i++) rows.push(new SkyscraperRow())
return rows
}
 
 class Skyscraper {
   constructor(start,end,id) {
  this.id = id
  this._height = 0
  this._solution = 0
  this.range = range(start, end)
  this.possibleHeights = this.range.reduce((hash,inRange)=>{
    hash[inRange] = true
    return hash
    },{})
  }

  get height() {
    return this._height
  }

  set height(height) {
    if (!this.possibleHeights[height]) throw new Error(`impossible`)
    this._height = height
    for (const val in this.possibleHeights){
      if (val != height) this.possibleHeights[val] = false
    }
  }

  updatePossibleHeights(min){
      for(let i=min;i<=6;i++){
        this.possibleHeights[i] = false
      }
  }

  getRangeSize(){
    let count = 0
    for (const key in this.possibleHeights){
      if (this.possibleHeights[key]) count++
    }
    this.rangeSize = count
    return count
  }

  getAllPossibleHeightsHash(){
    const obj = {}
    for (const key in this.possibleHeights){
      if (this.possibleHeights[key]) obj[key] = true
    }
    return obj
  }
}

class Node {
    constructor(val = null, west = null, east = null, north = null, south = null){
      this.val = val
      this.west = west
      this.east = east
      this.north = north
      this.south = south
    }
  }

class LinkedList {
    constructor(){
      this.head = new Node
      this.tail = new Node
      this._count = 0
    }

    updateColumnRanges(node){
      let torchlight = node.south
      while(typeof(torchlight.val) !== "number"){
      torchlight.val.possibleHeights[node.val.height] = false
      torchlight = torchlight.south
      }
      torchlight = node.north
      while(typeof(torchlight.val) !== "number"){
        torchlight.val.possibleHeights[node.val.height] = false
        torchlight = torchlight.north
      }
    }

    updateRowRanges(node){
      let torchlight = node.east
      while(typeof(torchlight.val) !== "number"){
      torchlight.val.possibleHeights[node.val.height] = false
      torchlight = torchlight.east
      }
      torchlight = node.west
      while(typeof(torchlight.val) !== "number"){
        torchlight.val.possibleHeights[node.val.height] = false
        torchlight = torchlight.west
      }
    }

    getVisibleScrapers(dir){
      let startNode
      let endNode
      if (dir == 'west' || dir == 'south') {startNode = 'head'; endNode = 'tail'}
      else if (dir == 'north' || dir == 'east') {startNode = 'tail'; endNode = 'head'}
      else throw Error("invalid direction")
      let visible = 0
      let currentView = 0
      let torchlight = this[startNode]
      while(torchlight[dir] !== this[endNode]){
        torchlight = torchlight[dir]
        if (torchlight.val.height > currentView) {
          visible++
          currentView = torchlight.val.height
          if (currentView == 6) break;
        }
      }
      return visible
    }

    findAllValidPaths(dir){
      let startNode
      let endNode
      if (dir == 'east' || dir == 'south') {startNode = 'head'; endNode = 'tail'}
      else if (dir == 'north' || dir == 'west') {startNode = 'tail'; endNode = 'head'}
      else throw Error("invalid direction")
      const dataArray = []
      const findNode = (node,array) => {
        if (node == this[endNode]) {
              dataArray.push(array)
              return
        }
        const heights = node.val.getAllPossibleHeightsHash()
        for (const key in heights){
          if (array.includes(key)) continue;
          const recursiveArr = new Array(...array,key)
          findNode(node[dir],recursiveArr)
        }
      }
      findNode(this[startNode][dir],[])
      return dataArray
    }
  
    validate(direction){
      let startNode
      if (direction == 'east' || direction == 'south') {startNode = 'head'}
      else if (direction == 'north' || direction == 'west') {startNode = 'tail'}
      else throw Error("invalid direction")
      if (this[startNode].val == 0) return true
      return this[startNode].val == this.getVisibleScrapers(direction)
    }

  }

  class SkyscraperColumn extends LinkedList {
    constructor(){
      super()
      this.head.south = this.tail
      this.tail.north = this.head
    }

  findLowFruit(height){
    let torchlight = this.head
    let possibleHomes = 0
    let home
    while (torchlight.south != this.tail){
      torchlight = torchlight.south
      if (torchlight.val.possibleHeights[height]) {
        possibleHomes++
        home = torchlight
      }
    }
    if (possibleHomes === 1 && home.val.height !== height){
      home.val.height = height
      this.updateColumnRanges(home)
      this.updateRowRanges(home)
      return true
    }
    return false
  }

  push(node) {
    const north = this.tail.north
    node.north = north
    node.south = this.tail
    north.south = node
    this.tail.north = node
    this._count++
    return this._count
    }

  getNodeWithShortestRange(){
    let node
    let shortest = Infinity
    let torchlight = this.head
      while(torchlight.south !== this.tail){
        torchlight = torchlight.south
        const current = torchlight.val.getRangeSize()
        if (current < shortest){
          shortest = current
          node = torchlight.val
        }
      }
    return [node,shortest]
  }

    sixDown(){
      let torchlight = this.head
      let height = 1
      while(torchlight.south !== this.tail){
        torchlight = torchlight.south
        torchlight.val.height = height
        this.updateRowRanges(torchlight)
        height++
      }
    }

    sixUp(){
      let torchlight = this.tail
      let height = 1
      while(torchlight.north !== this.head){
        torchlight = torchlight.north
        torchlight.val.height = height
        this.updateRowRanges(torchlight)
        height++
      }
    }

    updateRangesDown(limit){
      let torchlight = this.head
      while(torchlight.south !== this.tail && limit<=6){
        torchlight = torchlight.south
        torchlight.val.updatePossibleHeights(limit)
        limit++
      }
    }

    updateRangesUp(limit){
      let torchlight = this.tail
      while(torchlight.north !== this.head && limit<=6){
        torchlight = torchlight.north
        torchlight.val.updatePossibleHeights(limit)
        limit++
      }
    }

    oneDown(){
      let torchlight = this.head.south
      torchlight.val.height = 6
      this.updateColumnRanges(torchlight)
      this.updateRowRanges(torchlight)
    }
  
    oneUp(){
      let torchlight = this.tail.north
      torchlight.val.height = 6
      this.updateColumnRanges(torchlight)
      this.updateRowRanges(torchlight)
    }
    }

class SkyscraperRow extends LinkedList {
  constructor(){
  super()
  this.head.east = this.tail
  this.tail.west = this.head
  }

  push(node) {
    const west = this.tail.west
    node.west = west
    node.east = this.tail
    west.east = node
    this.tail.west = node
    this._count++
    return this._count
    }

  findLowFruit(height){
    let torchlight = this.head
    let possibleHomes = 0
    let home
    while (torchlight.east != this.tail){
      torchlight = torchlight.east
      if (torchlight.val.possibleHeights[height]) {
        possibleHomes++
        home = torchlight
      }
    }
    if (possibleHomes === 1 && home.val.height !== height){
    home.val.height = height
    this.updateColumnRanges(home)
    this.updateRowRanges(home)
    return true
    }
    return false
  }

  getNodeWithShortestRange(){
    let node
    let shortest = Infinity
    let torchlight = this.head
      while(torchlight.east !== this.tail){
        torchlight = torchlight.east
        const current = torchlight.val.getRangeSize()
        if (current < shortest){
          shortest = current
          node = torchlight.val
        }
      }
    return [node,shortest]
  }

  sixLeft(){
    let torchlight = this.head
    let height = 1
    while(torchlight.east !== this.tail){
      torchlight = torchlight.east
      torchlight.val.height = height
      this.updateColumnRanges(torchlight)
      height++
    }
  }

  sixRight(){
    let torchlight = this.tail
    let height = 1
    while(torchlight.west !== this.head){
      torchlight = torchlight.west
      torchlight.val.height = height
      this.updateColumnRanges(torchlight)
      height++
    }
  }

  updateRangesLeft(limit){
    let torchlight = this.head
    while(torchlight.east !== this.tail && limit<=6){
      torchlight = torchlight.east
      torchlight.val.updatePossibleHeights(limit)
      limit++
    }
  }

  updateRangesRight(limit){
    let torchlight = this.tail
    while(torchlight.west !== this.head && limit<=6){
      torchlight = torchlight.west
      torchlight.val.updatePossibleHeights(limit)
      limit++
    }
  }

  oneLeft(){
    let torchlight = this.head.east
    torchlight.val.height = 6
    this.updateRowRanges(torchlight)
    this.updateColumnRanges(torchlight)
  }

  oneRight(){
    let torchlight = this.tail.west
    torchlight.val.height = 6
    this.updateRowRanges(torchlight)
    this.updateColumnRanges(torchlight)
  }
}

 class Board {
   constructor(clues, solution = []){
    this.size = clues.length/4
    this.columns = getColumns(this.size)
    this.rows = getRows(this.size)
    this.solution = solution
    this.clues = clues
    this.clueMap = []
    this.solutionMap = []
   }

   init(){
     let id = 0
    for (let i = 0; i < 6; i++) {
      this.solutionMap.push([])
      for (let j = 0; j < 6; j++) {
        const val = new Skyscraper(1,6,id)
        id++
        const nextNode = new Node(val)
        this.solutionMap[i].push(nextNode)
        this.columns[j].push(nextNode)
        this.rows[i].push(nextNode)
      }
    }
   }

  populateHeadOfColumn(){
    for (let i=0;i<this.columns.length;i++){
      this.columns[i].head.val = this.clues.shift()
      this.clueMap.push(this.columns[i].head)
    }
  }

  populateTailOfRow(){
      for (let i=0;i<this.rows.length;i++){
        this.rows[i].tail.val = this.clues.shift()
        this.clueMap.push(this.rows[i].tail)
      }
  }

  populateTailOfColumn(){
    for (let i=0;i<this.columns.length;i++){
      this.columns[this.columns.length-1-i].tail.val = this.clues.shift()
      this.clueMap.push(this.columns[i].tail)
    }
  }

  populateHeadOfRow(){
    for (let i=0;i<this.rows.length;i++){
      this.rows[this.rows.length-1-i].head.val = this.clues.shift()
      this.clueMap.push(this.rows[i].head)
    }
  }

  populateBoardWithClues(){
    this.populateHeadOfColumn()
    this.populateTailOfRow()
    this.populateTailOfColumn()
    this.populateHeadOfRow()
  }

  six(i){
    const index = i%this.size
    switch(Math.floor(i/6)){
      case 0:
        this.columns[index].sixDown()
        break;
      case 1:
        this.rows[index].sixRight()
        break;
      case 2:
        this.columns[5-index].sixUp()
        break;
      case 3:
        this.rows[5-index].sixLeft()
        break;
    }
  }

  one(i){
    const index = i%this.size
    switch(Math.floor(i/6)){
      case 0:
        if (index == 5) return
        this.columns[index].oneDown()
        break;
      case 1:
        if (index == 5) return
        this.rows[index].oneRight()
        break;
      case 2:
        this.columns[5-index].oneUp()
        break;
      case 3:
        this.rows[5-index].oneLeft()
        break;
    }
  }

  updateRanges(i,min){
    const index = i%this.size
    switch(Math.floor(i/6)){
      case 0:
        this.columns[index].updateRangesDown(min)
        break;
      case 1:
        this.rows[index].updateRangesRight(min)
        break;
      case 2:
        this.columns[5-index].updateRangesUp(min)
        break;
      case 3:
        this.rows[5-index].updateRangesLeft(min)
        break;
    }
  }

  solveBoard(){
    const tuple = this.columns.reduce((a,b)=> {
      const tuple = b.getNodeWithShortestRange()
      return tuple[1]<a[1]?tuple:a},[null,6])
    for (const key in tuple[0].possibleHeights){
      
    }
  }
}

function noClash(array,r){
  return (
    array[0] !== r[0]
    && array[1] !== r[1]
    && array[2] !== r[2]
    && array[3] !== r[3]
    && array[4] !== r[4]
    && array[5] !== r[5]
  )
}
