import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserSchema } from '@/validations/user';

interface Props {
  onSubmit: (data: UserSchema) => Promise<void>;
  title: string;
}

export default function AuthForm({ onSubmit, title }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({ resolver: zodResolver(userSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">{title}</h2>
      <input {...register('email')} placeholder="Email" className="input input-bordered w-full" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input type="password" {...register('password')} placeholder="Password" className="input input-bordered w-full" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <button type="submit" className="btn btn-primary w-full">{title}</button>
    </form>
  );
}
