# Type conversion
a = 4
b = 3.00
print(a+b)
#usually an int is converted into a float as its cinsidered as a superior value!
#now if i write, a = "2" and proceed, we get an error as a string cannot be added to float

#type casting
h = int("65")
k = 5.00
print(type(h))
print(h+k)#yaha par both casting and conversion hua....
# :) kaisa bole to, h pele int bana(by casting) and then as k is a float, and as we were adding h and k, h float bangaya(by conversion)
int("5")
#input
name = input("enter your name: ")
print("welcome: ", name)
age = input("enter your age: ")
print("oooh, ur this old:) >>", age)
val = input("enter some random value: ")
print(type(val))#as we know, result of input is always a str
#but if we want the specific data type, we use casting
 
val2 = int(input("enter some value: "))
print(type(val2))#i tried something, agar yaha val2 ko ek flaot value diye to, obv it wouldnt be able to convert into int!!
