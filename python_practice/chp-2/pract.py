#wap to input users first name and print its length
name = input("write your name:")
print("the length of your name is:", len(name))

# #wap to find the occurence of "$" in a string
str_ = "heyaaaa, i am a string:)"
print(str_.count("a"))

#wap to check if a number entered by user is odd or even
num = int(input("enter any number: "))
if(num %2 == 0):
    print("the number is even")
else:
    print("the number is odd")


#wap to find the greatest of 3 numbers entered by the user
num1 = float(input("enter any number: "))
num2 = float(input("enter any number: "))
num3 = float(input("enter any number: "))
if(num1 > num2):
    g = num1
else:
    g = num2
if(g > num3):
    greatest_number = g
else:
    greatest_number = num3
print("greatest of all three numbers is: ", greatest_number)


#wap to check if a number is multiple of 7 or not
num_1 = int(input("enter a number: "))
if(num_1 % 7 == 0):
    print("number is divisible by 7")
else:
    print("number is divisible by 7")

#wap to find the greatest of 4 numbers entered by the user
a = float(input("enter any number: "))
b = float(input("enter any number: "))
c = float(input("enter any number: "))
d = float(input("enter any number: "))

if(a>b and a>c and a>d):
    print("the greatest number is: ", a)
elif(b>c and b>d):
    print("the greatest number is: ", b)
elif(c>d):
    print("the greatest number is: ", c)
else:
    print("the greatest number is: ", d)

