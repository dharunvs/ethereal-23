with open("test.txt", 'r') as f:
    a = f.readlines()

b = []

for i in a:
    b.append(i.strip())
print(b)