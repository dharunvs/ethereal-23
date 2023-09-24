import uuid

college = "KCG College Of Technology"

def create_concert():
    t = "concert_"+str(uuid.uuid4())
    return t


def create_code():
    unique_id = str(uuid.uuid4())
    code = unique_id.replace('-', '')[:6]
    return code

with open("/home/DharunVS/__Github__/Ethereal/ethereal-private/transactions/350data.csv", 'r') as f:
    data = f.readlines()

print(data)
s = []
for i in data:
    a = i.split(",")
    print(a)
    b = f"INSERT INTO users(id, name, email, phone, ethereal, combo_eligible, college) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{a[2].strip()}', '{create_code()}', TRUE, '{college}');\n"
    s.append(b)

print(s)

with open("/home/DharunVS/__Github__/Ethereal/ethereal-private/transactions/data350.sql", "w+") as f:
    f.writelines(s)
