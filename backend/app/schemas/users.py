from pydantic import BaseModel, EmailStr

class UsersCreate(BaseModel):
    email: EmailStr
    password: str

class UsesrResponse(BaseModel):
    id: int
    email: EmailStr
