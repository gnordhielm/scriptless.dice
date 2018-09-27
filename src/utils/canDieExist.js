// http://mathworld.wolfram.com/Isohedron.html
/*
cube, 
disdyakis dodecahedron, 
deltoidal hexecontahedron, 
deltoidal icositetrahedron, 
disdyakis triacontahedron, 
dodecahedron, 
dyakis dodecahedron, 
hexakis tetrahedron, 
icosahedron, 
octahedral pentagonal dodecahedron, 
octahedron, 
pentagonal hexecontahedron, 
pentagonal icositetrahedron, 
pentakis dodecahedron, 
rhombic dodecahedron, 
rhombic triacontahedron, 
small triakis octahedron, 
tetragonal pentagonal dodecahedron, 
tetrahedron, 
tetrakis hexahedron, 
trapezoidal dodecahedron, 
great triakis octahedron, 
and triakis tetrahedron,

TO DO - filter out shapes which are functionally the same
*/


export default sides => {
  
  // cannot exist in 3 dimensions
  if (sides <= 3)
    return false

  // must have an even number of sides
  if (sides % 2)
    return false

  return true
}