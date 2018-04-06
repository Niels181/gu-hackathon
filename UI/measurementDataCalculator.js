let array = [1,2,5,4,5];
let result = [];

console.log(array.length);

for (i=0; i<array.length-1; i++)
{
    val1 = array[i];
    val2 = array[i+1];
    result.push(val2-val1);  
}


console.log(result);