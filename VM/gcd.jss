input 100
input 101
cmp 100 101 102
jz 102 30
cmm 100 101 103
jnz 103 24
sub 100 101 100
jmp 4
sub 101 100 101
jmp 4
output 100
exit