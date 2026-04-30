#tuples
#a built in data type that lets us create immutable sqequences of values
tup = (43, 57, 87265)
print(type(tup))
print(tup[2])
tup1 = (1)
print(type(tup1))#integer
typ2 = (1,)
print(type(typ2))#tuples
# typ2[0] = 2 ##does not suppport item assignment
#can alos do slicing
#can also create an empty tuple #tup=() 

#tuple methods
tupp= (1, 2, 3, 4)
print(tupp.index(3))#returns index of the first occurence of the mentioned element
print(tupp.count(4))
