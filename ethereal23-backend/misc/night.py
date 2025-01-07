with open('t1.csv', 'r') as f:
    t1 = f.readlines()

t = []
for i in t1:
    t.append(i.strip())


with open('desklist-ic.csv', 'r') as f:
    ic1 = f.readlines()

ic2 = []
ic = []
for i in ic1:
    ic2.append(i.split(","))

for i in ic2:
    if (i[1] in t):
        ic.append([i[0], i[1], i[2], i[3].strip(), "t"])
    else:
        ic.append([i[0], i[1], i[2], i[3].strip(), ""])

s = ""
for i in ic:
    s += ",".join(i)+"\n"

with open("nightOut/desklist-ic.csv", 'w') as f:
    f.write(s)


with open('desklist-oc.csv', 'r') as f:
    oc1 = f.readlines()

oc2 = []
oc = []
for i in oc1:
    oc2.append(i.split(","))

for i in oc2:
    if (i[1] in t):
        oc.append([i[0], i[1], i[2], i[3].strip(), "t"])
    else:
        oc.append([i[0], i[1], i[2], i[3].strip(), ""])

s = ""
for i in oc:
    s += ",".join(i)+"\n"

with open("nightOut/desklist-oc.csv", 'w') as f:
    f.write(s)
