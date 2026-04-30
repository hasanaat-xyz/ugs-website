# escape sequence characters
str1 = "this is a string.\nwe r using it in python"#next line me aate sentences
print(str1)
str2= "this is a string.\twe r using it in pythin"#tab aata isse
print(str2)

#concatination
str3 = "amat"
str4 = "ul"
print(str3+str4)

#length of string
print(len(str3))
#>>>>>
str5 = "cristiano"
str6 = "ronaldo"
hf = str5+ " " + str6
print(hf)
print(len(hf))# the space is also counted as a character

#indexing (used to access specific characters of a string)
str_= "amatul salaam hafsa"
print(str_[6])#empty space

#slicing
st = "pillow"
print(st[2:5])# llo aata
print(st[ :3])# pil.....# its same as str[0:3]
print(st[2:])#poori length of str gets cut from 2nd index....llow
#negative slicing
st1 = "cocomelon"
print(st1[5 - len(st1) : -1])#elo
print(st1[0 : -1])#...:) guess what...this does work!!
print(st1[-1 : -4])# oooh...i got aa blank!

#string functions

s = "i am not a coder, currently!"
print(s.endswith("ly!"))#true
print(s.capitalize())#I am not.....1st charac ko capitalize karta he...
print(s)# here, the i does not get capitalised as, the str func. does not change the original value of variable!
s = s.capitalize()
print(s)#yaha, the value of variable is stored in the original variable!...so, u get "I"..
### str functions dosent change the value of the original variable!!...they make new strings and make changes with them
print(s.replace("currently", "yet"))
print(s.find("a"))
print(s.count("e"))
