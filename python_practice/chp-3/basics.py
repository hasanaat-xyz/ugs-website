#list!
marks = [65, 87.3, "siuu", 54.3]
print(marks)
print(type(marks))#class <list>
print(marks[2])
print(len(marks))

#diff between lists and string
# str1 = "hello"
# str1[0] = "c"
# "object does not support item assignment"

student = ["karan", 24, 98.67, "haryana"]
student[0] = "arjun"
print(student[0])

#list slicing
list1= [1,2,3,4,7,8]
print(list1[2:4])
#the rules which were for string are same here + negative indices work too

#list methods
listr = [32,65,97,864]
listr.append(34)
print(listr)

listr.sort()#inc order
print(listr)
listr.sort(reverse = True)#dec order
print(listr)
listr.reverse()
print(listr)
# #these list methods didnt create a new list they just mutated the original list.


nums = [10, 20, 30]
x= nums.append(40)
print("nums: ", nums)
#here, the method does gets called even if we assigned its value to a variable...
#what happens is; the method does it work and then returns none value to the variable and 
#if u print x; u get none

listr.insert(2, "siuuu")
print(listr)

listc = ["apple", "cristiano ronaldo", "neymar jr", "banana"]
listc.sort()
print(listc)
listc.insert(3, "doll")
print(listc)

listc.remove("doll")#remives the first occurence of this element
print(listc)
listc.pop(3)#removes the element at index 3
print(listc)
