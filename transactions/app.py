import uuid

# college = "Sathyabama University (Sathyabama Engineering College), Chennai"
college = "KCG College Of Technology"
file = "qr-db"

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
    # b = f"INSERT INTO users(id, name, email, phone, college, concert, concert_code) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{a[2].strip()}', '{college}', '{create_concert()}', '{create_code()}');\n"
    # b = f"INSERT INTO users(id, name, email, college, ethereal, concert, concert_code, first_year) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{college}',  '{a[2].strip()}', '{create_concert()}', '{create_code()}', TRUE);\n"
    # b=f"UPDATE users SET ethereal = '{create_code()}' , combo_eligible = TRUE WHERE email = '{a[1].lower().strip()}';\n"
    # b=f"UPDATE users SET ethereal = '{create_code()}' , concert = '{create_concert()}' , concert_code = '{create_code()}' WHERE email = '{a[1].lower().strip()}';\n"
    # b=f"UPDATE users SET concert = '{create_concert()}' , concert_code = '{create_code()}' WHERE email = '{a[1].lower().strip()}';\n"
    # b=f"UPDATE users SET first_year = TRUE WHERE email = '{a[1].lower().strip()}';\n"
    # b=f"select email, name, ethereal, concert, concert_code from users where email = '{a[1].lower().strip()}' and (ethereal <> '' or concert_code <> '');\n"
    # b=f"select ethereal, concert, concert_code, first_year, email from users where email = '{a[1].lower().strip()}';\n"
    # b=f"select COUNT(first_year) from users where email = '{a[1].lower().strip()}';\n"
    # b=f"delete from users where email = '{a[1].lower().strip()}';\n"


    # b=f"UPDATE users SET concert = '{create_concert()}' , concert_code = '{create_code()}' WHERE email = '{a[2].lower().strip()}';\n"


    # b=f"select ethereal, concert_code, email from users where email = '{a[2].lower().strip()}';\n"
    # b = f"INSERT INTO users(id, name, email, phone, ethereal, concert, concert_code, college) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{a[2].strip()}', '{create_code()}', '{create_concert()}', '{create_code()}', '{college}');\n"
    # b = f"INSERT INTO users(id, name, email, phone, ethereal, college) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{a[2].strip()}', '{create_code()}', '{college}');\n"

    # b = f"INSERT INTO users(id, name, email, college, ethereal, first_year) VALUES ('{str(uuid.uuid4())}', '{a[0].strip()}', '{a[1].lower().strip()}', '{college}', '{create_code()}', TRUE);\n"

    b = f"INSERT INTO qr(code, name) VALUES ('{a[1].strip()}', '{a[0].strip()}');\n"

    s.append(b)

print(s)

with open("/home/DharunVS/__Github__/Ethereal/ethereal-private/transactions/"+file+".sql", "w+") as f:
    f.writelines(s)



#             email             |   name   | ethereal |                   concert                    | concert_code 
# ------------------------------+----------+----------+----------------------------------------------+--------------
#  hariniharini784242@gmail.com | Harini R | a22b2e   | concert_095e14a0-8532-443f-864c-841f61bb9092 | 34fae6
# (1 row)

#            email            |   name   | ethereal |                   concert                    | concert_code 
# ----------------------------+----------+----------+----------------------------------------------+--------------
#  harshiniarul2005@gmail.com | Harshini | 58b562   | concert_80a34454-d313-4ea6-bf0d-fe8a81e25795 | 0974f0
# (1 row)





#          email         |   name    | ethereal 
# -----------------------+-----------+----------
#  nithishwnl3@gmail.com | Nithish R | 
# (1 row)

#         email        |    name     | ethereal 
# ---------------------+-------------+----------
#  vijayh091@gmail.com | Hariharan S | 
# (1 row)


# divinapatricia953@gmail.com
# gokulvva2005@gmail.com
# manoj1311ai@gmail.com




#              email              |        name         | ethereal | concert | concert_code | first_year 
# --------------------------------+---------------------+----------+---------+--------------+------------
#  praveen.kannapureddy@gmail.com | Praveen Kumar Reddy | db6b72   |         |              | f
# (1 row)

#             email            |   name    | ethereal |                   concert                    | concert_code | first_year 
# -----------------------------+-----------+----------+----------------------------------------------+--------------+------------
#  aswathivanitha111@gmail.com | aswathi r | ec4e6f   | concert_19f7f014-9257-4938-8471-112f745fd9b4 | c7ed96       | t
# (1 row)

#             email            |   name    | ethereal |                   concert                    | concert_code | first_year 
# -----------------------------+-----------+----------+----------------------------------------------+--------------+------------
#  aswathivanitha111@gmail.com | aswathi r | ec4e6f   | concert_19f7f014-9257-4938-8471-112f745fd9b4 | c7ed96       | t
# (1 row)


#          email         |        name        | ethereal |                   concert                    | concert_code | first_year 
# -----------------------+--------------------+----------+----------------------------------------------+--------------+------------
#  22it07@kcgcollege.com | Chris Livingstone  | 5fb126   | concert_804d343c-cf36-4220-804d-ee7645585b47 | cbb49e       | f
# (1 row)


#          email          |    name     | ethereal |                   concert                    | concert_code | first_year 
# ------------------------+-------------+----------+----------------------------------------------+--------------+------------
#  joshuabinu25@gmail.com | joshua binu | 63d7e6   | concert_bed65a4e-84d2-4455-a2da-c19621ef1038 | 17ec0e       | t
# (1 row)

#          email         |    name     | ethereal |                   concert                    | concert_code | first_year 
# -----------------------+-------------+----------+----------------------------------------------+--------------+------------
#  mahea02s007@gmail.com | Maheshwar A | bcead5   | concert_a45b14dd-159d-4b88-837e-693698073b5c | f20ae3       | t
# (1 row)

#           email           |    name     | ethereal |                   concert                    | concert_code | first_year 
# --------------------------+-------------+----------+----------------------------------------------+--------------+------------
#  pintukanee2005@gmail.com | Kaneeskar S | ffa370   | concert_7a3e69e1-c219-4e75-bf8d-647dc92456ab | 59eda9       | t
# (1 row)

#          email         |     name      | ethereal |                   concert                    | concert_code | first_year 
# -----------------------+---------------+----------+----------------------------------------------+--------------+------------
#  shafika1518@gmail.com | shafika shren | e62a71   | concert_040852d2-d257-4170-8016-fef9dc7d2bd9 | d7f408       | t
# (1 row)

#            email           |     name      | ethereal |                   concert                    | concert_code | first_year 
# ---------------------------+---------------+----------+----------------------------------------------+--------------+------------
#  sharlicharles04@gmail.com | sharlipriya C | e34442   | concert_5948f650-bde9-482e-b710-b07555e0ee7e | 5e79c5       | t
# (1 row)

#             email             |       name       | ethereal |                   concert                    | concert_code | first_year 
# ------------------------------+------------------+----------+----------------------------------------------+--------------+------------
#  eshwantbalaji.2006@gmail.com | eshwant balaji s | 1769cc   | concert_59714af6-410e-4c8b-baa0-8c8b4192014d | 0567c6       | t
# (1 row)

#          email          |   name    | ethereal |                   concert                    | concert_code | first_year 
# ------------------------+-----------+----------+----------------------------------------------+--------------+------------
#  shreyasj0611@gmail.com | shreya sj | 345428   | concert_3e366efe-dfe4-496f-b6d2-1580f64c5765 | 9ce81b       | t
# (1 row)

#          email          |   name    | ethereal |                   concert                    | concert_code | first_year 
# ------------------------+-----------+----------+----------------------------------------------+--------------+------------
#  sanjaymogesh@gmail.com | V. Sanjay |          | concert_39363978-c2da-4c37-8e1e-1264a0aa0dda | 33c8b1       | f
# (1 row)


#         email        |      name       | ethereal |                   concert                    | concert_code | first_year 
# ---------------------+-----------------+----------+----------------------------------------------+--------------+------------
#  jenioct03@gmail.com | jenika stella p | 9d0e0b   | concert_6f983c7c-83ee-4eb3-b389-d995893ccac1 | 8b0d56       | t
# (1 row)


#         email         |    name    | ethereal |                   concert                    | concert_code | first_year 
# ----------------------+------------+----------+----------------------------------------------+--------------+------------
#  harinikk81@gmail.com | harini k k | b9a956   | concert_31bb2c6c-2d93-4057-9977-4d90122e5445 | 8807c4       | t
# (1 row)

#             email             |       name        | ethereal |                   concert                    | concert_code | first_year 
# ------------------------------+-------------------+----------+----------------------------------------------+--------------+------------
#  harshavardhini1704@gmail.com | Harsha Vardhini A | 4914b8   | concert_3d11c9da-c289-488c-b4f6-eaad5e67dd69 | fd51c7       | t
# (1 row)

#             email             |     name     | ethereal |                   concert                    | concert_code | first_year 
# ------------------------------+--------------+----------+----------------------------------------------+--------------+------------
#  madhumithamurali09@gmail.com | MADHUMITHA M | faab98   | concert_e6f9b677-aaa5-49c9-82ac-5c178d0b2ad1 | e0883f       | t
# (1 row)
