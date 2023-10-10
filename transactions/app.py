import uuid

college = "Sathyabama University (Sathyabama Engineering College), Chennai"
file = "900data002_newu"

def create_concert():
    t = "concert_"+str(uuid.uuid4())
    return t


def create_code():
    unique_id = str(uuid.uuid4())
    code = unique_id.replace('-', '')[:6]
    return code

with open("/home/DharunVS/__Github__/Ethereal/ethereal-private/transactions/"+file+".csv", 'r') as f:
    data = f.readlines()

# print(data)
s = []
for i in data:
    a = i.split(",")
    print(a)
    # b = f"INSERT INTO users(id, name, email, phone, ethereal, combo_eligible, college) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{a[2].strip()}', '{create_code()}', TRUE, '{college}');\n"
    # b = f"INSERT INTO users(id, name, email, phone, ethereal, combo_eligible, college, concert, concert_code) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{a[2].strip()}', '{create_code()}', TRUE, '{college}', '{create_concert()}', '{create_code()}');\n"
    b = f"INSERT INTO users(id, name, email, phone, college, concert, concert_code) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{a[2].strip()}', '{college}', '{create_concert()}', '{create_code()}');\n"
    # b=f"UPDATE users SET ethereal = '{create_code()}' , combo_eligible = TRUE WHERE email = '{a[1].lower().strip()}';\n"
    # b=f"UPDATE users SET ethereal = '{create_code()}' , concert = '{create_concert()}' , concert_code = '{create_code()}' WHERE email = '{a[1].lower().strip()}';\n"
    # b=f"UPDATE users SET concert = '{create_concert()}' , concert_code = '{create_code()}' WHERE email = '{a[1].lower().strip()}';\n"
    # b=f"select email, name, ethereal from users where email = '{a[1].lower().strip()}';\n"
    s.append(b)

print(s)

with open("/home/DharunVS/__Github__/Ethereal/ethereal-private/transactions/"+file+".sql", "w+") as f:
    f.writelines(s)


# 