# -----------------------------------------------------------------------
# from uuid import uuid4
# dic = {"events":[]}

# with open("out/dbInput.txt", 'r') as f:
#     a = f.read()
#     a = a.splitlines()

# for i in a:
#     dic["events"].append({
#         "eventId": "event_"+str(uuid4()),
#         "name": i,
#         "mode": "offline" ,
#         "min": 1,
#         "max": 1,
#     })

# dic = str(dic)

# with open("out/events.json", "w") as f:
#     f.write(dic)

# print(dic)

# -----------------------------------------------------------------------
# import json

# li = []
# with open("events.json", 'r') as f:
#     data = json.load(f)

# for i in data["events"]:
#     li.append(i["eventId"])

# print(len(li))
# print(len(set(li)))

# -----------------------------------------------------------------------
# from uuid import uuid4
# import json

# tickets = {
#     "Assigned": 0,
#     "concertTickets": []
# }

# for i in range(2250):
#     tickets["concertTickets"].append({"id": "concert_"+str(uuid4()),
#                                       "userId": None,
#                                       "userEmail": None})

# tics = []

# for i in tickets["concertTickets"]:
#     tics.append(i["id"])

# print(len(tics))
# print(len(set(tics)))

# with open("concertTickets.json", "w") as json_file:
#     json.dump(tickets, json_file)

# -----------------------------------------------------------------------
# from uuid import uuid4

# li = []

# for i in range(999999):
#     li.append(uuid4())

# print(len(li))
# print(len(set(li)))

# ----------------------------------------
# ----------------------------------------
# ----------------------------------------
# ----------------------------------------

# import json

# with open("out/events.json", 'r') as f:
#     events = json.load(f)

# s =[]
# for i in events["events"]:
#     s.append(f"INSERT INTO events(event_id, name, mode, min, max) VALUES('{i['eventId']}', '{i['name']}', '{i['mode']}', '{i['min']}', '{i['max']}');\n")

# with open("out/insertEvents.sql", "w") as f:
#     f.writelines(s)

# print(events)

# ----------------------------------------
# ----------------------------------------
# ----------------------------------------
# ----------------------------------------


# import json

# with open("out/events.json", 'r') as f:
#     events = json.load(f)

# s =[]
# count = 1
# for i in events["events"]:
#     s.append(f"import posterImg{count} from './{i['eventId']}.png';\n")
#     count += 1

# s.append("export const posterImg = {\n")

# count = 1
# for i in events["events"]:
#     s.append(f"'{i['eventId']}': posterImg{count},\n")
#     count += 1


# s.append("};")

# with open("out/imports.js", "w") as f:
#     f.writelines(s)

# print(events)

# ----------------------------------------
# ----------------------------------------
# ----------------------------------------
# ----------------------------------------


# import json

# with open("out/events.json", 'r') as f:
#     events = json.load(f)

# s =[]
# count = 1
# for i in events["events"]:
#     s.append(f"posterImg{count},\n")
#     count += 1

# # s.append("export const posterImg = {\n")

# # count = 1
# # for i in events["events"]:
# #     s.append(f"'{i['eventId']}': posterImg{count},\n")
# #     count += 1


# # s.append("};")

# with open("out/imports.js", "w") as f:
#     f.writelines(s)

# print(events)

# ----------------------------------------
# ----------------------------------------
# ----------------------------------------
# ----------------------------------------

# import json

# with open("out/colleges.txt", 'r') as f:
#     d = f.readlines()

# s = []

# for i in d:
#     s.append(f'''"{i.strip()}",\n''')

# with open("out/colleges_out.txt", "w") as f:
#     f.writelines(s)


# ----------------------------------------
# ----------------------------------------
# ----------------------------------------
# ----------------------------------------



# s =[]
# count = 1
# for i in range(1, 25):
#     s.append(f"import galleryImg{i} from './gallery_{i}.jpg';\n")

# s.append("export const posterImg = {\n")

# count = 1
# for i in events["events"]:
#     s.append(f"'{i['eventId']}': posterImg{count},\n")
#     count += 1


# s.append("};")

# with open("out/imports2.js", "w") as f:
#     f.writelines(s)

# print(events)

import json

with open ("Total registrations.csv", 'r') as f:
    r = f.readlines()
with open('registrationsOnline.json', 'r') as file:
    data = json.load(file)

total = data["registrations"]
outer = []
inner = []
innerEth = []
innerCon = []
concert_inner = []
concert_outer = []
total_revenue = []
innerConCom = []
innerConNoCom = []

outerEth   = []
outerConCom = []
outerCon = []
outerConNoCom = []

id_email = {}

temp = []

fees = {
     "ethereal": 350,
     "ic_combo_concert": 550,
     "oc_combo": 1199,
     "ic_concert": 900,
     "oc_concert": 1099,
     "ic_both": 1260
}


for i in total:
    # print(i["user"]["userId"])
    for j in r:
        if i["user"]["userId"] == j.split(',')[0]:
            # print(j[0])
            id_email[i["user"]["userId"]] = j.split(',')[2]


def is_inner_college(email):
    email_parts = email.split("@")
    if email_parts[-1] == "kcgcollege.com":
        return True
    return False


count = 1
for i in total:
    print(count)
    try:
        if (is_inner_college(id_email[i['user']['userId']])):
            inner.append(i)
            if i['user']['type'].lower() == "ethereal":
                innerEth.append(i)
            elif i['user']['type'].lower() == "ic_combo_concert":
                innerConCom.append(i)
            elif i['user']['type'].lower() == "ic_concert":
                innerCon.append(i)
            elif i['user']['type'].lower() == "ic_both":
                innerConNoCom.append(i)
    
                
        else :
            outer.append(i)
            if i['user']['type'].lower() == "ethereal":
                outerEth.append(i)
            elif i['user']['type'].lower() == "oc_combo":
                outerConCom.append(i)
            elif i['user']['type'].lower() == "oc_concert":
                outerCon.append(i)
      
        
        total_revenue.append(fees[i['user']['type'].lower()])
    except Exception as e:
        print("--->", e)
        pass
    count += 1

# for i in total:
    
print("Total", len(total))
print("Inner", len(inner))
print("Outer", len(outer))
print("Inner ethereal", len(innerEth))
print("inner concert", len(innerCon))
print("inner com concert", len(innerConCom))
print("inner concert", len(innerConNoCom))

print("Outer ethereal", len(outerEth))
print("Outer concert", len(outerCon))
print("Outer com concert", len(outerConCom))


print("total revenue", sum(total_revenue) - len(total)*10)
print("total convenience", len(total)*10)
print("total revenue", sum(total_revenue))





