"use client";

import { useFormState } from "react-dom";
import { updateProfile } from "./actions";

const initialState = {
    error: null as string | null,
};

export default function SetupPage() {
    const [state, formAction] = useFormState(updateProfile, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="w-full max-w-lg space-y-8 animate-in zoom-in duration-500">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-[900] tracking-tighter uppercase italic">
                        🆔 Identity Setup
                    </h1>
                    <p className="text-lg opacity-50 font-medium">
                        아레나에서 사용할 신분을 등록하세요.
                    </p>
                </div>

                <form action={formAction} className="space-y-8 border-[3px] border-foreground p-8 bg-background bw-glow">

                    {/* Nickname */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest">Nickname</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="멋진 닉네임을 입력하세요 (2~12자)"
                            className="w-full p-4 border-[3px] border-foreground bg-transparent font-bold focus:outline-none focus:ring-4 focus:ring-foreground/10 placeholder:opacity-30"
                            required
                            minLength={2}
                            maxLength={12}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Age */}
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest">Age</label>
                            <input
                                name="age"
                                type="number"
                                placeholder="나이"
                                min={10}
                                max={100}
                                className="w-full p-4 border-[3px] border-foreground bg-transparent font-bold focus:outline-none focus:ring-4 focus:ring-foreground/10 placeholder:opacity-30"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest">Gender</label>
                            <select
                                name="gender"
                                className="w-full p-4 border-[3px] border-foreground bg-transparent font-bold focus:outline-none focus:ring-4 focus:ring-foreground/10 appearance-none"
                                required
                                defaultValue=""
                            >
                                <option value="" disabled className="text-black">선택하세요</option>
                                <option value="male" className="text-black">남성 (Male)</option>
                                <option value="female" className="text-black">여성 (Female)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-foreground text-background text-xl font-[900] uppercase tracking-tighter hover:opacity-90 transition-opacity"
                    >
                        Complete Setup →
                    </button>

                    {state?.error && (
                        <p className="text-center text-sm font-bold text-red-500 animate-pulse">
                            🚨 {state.error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
