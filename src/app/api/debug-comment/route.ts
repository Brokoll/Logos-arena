import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// DEBUG ROUTE: Test comment insertion directly
// Access via: http://localhost:3000/api/debug-comment?argumentId=XXX
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const argumentId = searchParams.get('argumentId');

    if (!argumentId) {
        return NextResponse.json({ error: 'argumentId required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("DEBUG - User:", user?.id || "NO USER");
    console.log("DEBUG - Auth Error:", authError);

    if (!user) {
        return NextResponse.json({
            error: 'Not authenticated',
            authError: authError?.message
        }, { status: 401 });
    }

    // 2. Try insert
    const testContent = `Debug test at ${new Date().toISOString()}`;
    const { data: insertData, error: insertError } = await supabase
        .from("comments")
        .insert({
            argument_id: argumentId,
            user_id: user.id,
            content: testContent
        })
        .select()
        .single();

    console.log("DEBUG - Insert Data:", insertData);
    console.log("DEBUG - Insert Error:", insertError);

    // 3. Fetch all comments for this argument
    const { data: comments, error: fetchError } = await supabase
        .from("comments")
        .select("*")
        .eq("argument_id", argumentId);

    console.log("DEBUG - Fetch Data:", comments);
    console.log("DEBUG - Fetch Error:", fetchError);

    return NextResponse.json({
        user: user.id,
        insertResult: { data: insertData, error: insertError?.message },
        fetchResult: { data: comments, error: fetchError?.message }
    });
}
