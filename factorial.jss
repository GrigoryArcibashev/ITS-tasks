set 99 1
set 100 2
set 101 1
input 102
cmpl 100 102 103
jnz 103 28
mult 101 100 101
add 100 99 100
jmp 11
output 101
exit