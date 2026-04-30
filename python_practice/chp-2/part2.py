#conditional statements
# age = int(input("enter your age: "))
# if(age>=18):
#     print("you are eligible")
# else:
#     print("u r not eligible")
# light = input("pls enter the colour of traffic light: ")
# if(light == "red"):
#     print("stop")
# elif(light == "green"):
#     print("go")
# elif(light == "yellow"):
#     print("wait")
# else:
    # print(":)")
# the diff between if and elif:
#elif only works if the if statemrnts is false
#the if statement always checks the cndition irrespective of others!

# num = 56
# if(num >2):
#     print("number is greater than 2")
# if(num >3):
#     print("number is greater than 3")
# here, if we used elif in 23 line, then only the first statement gets into work
#and if "if" is used, both the conditions gets checked

#grade students based on marks
#narks>= 90, grade A
#90>marks>=80, grade B
#80>marks>=70, grade C
#70> marks, grade D
# marks = int(input("pls enter ur marks: "))
# if(marks >= 90):
#     print("Grade A")
# elif(90>marks and marks>=80):
#     print("Grade B")
# elif(80>marks and marks>=70):
#     print("Grade C")
# elif(70>marks):
#     print("Grade D")

#nesting
age = int(input('enter age: '))
if(age >= 18):
    if(age>=80):
        print("cannot drive")
    else:
        print("can drive")
else:
    print("cannot drive")