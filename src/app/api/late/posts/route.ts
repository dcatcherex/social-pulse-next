import { NextRequest, NextResponse } from 'next/server';

const LATE_API_URL = 'https://getlate.dev/api/v1';
const LATE_API_KEY = process.env.LATE_API_KEY;

// GET /api/late/posts - Get posts with optional filters
export async function GET(request: NextRequest) {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    
    const url = new URL(`${LATE_API_URL}/posts`);
    
    // Forward all query parameters
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Late API] Get posts error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Late API] Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/late/posts - Create/schedule a new post
export async function POST(request: NextRequest) {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    if (!body.platforms || body.platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${LATE_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Late API] Create post error:', error);
      
      // Handle specific error codes
      if (response.status === 402) {
        return NextResponse.json(
          { error: 'Plan limit exceeded. Please upgrade your Late plan.' },
          { status: 402 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[Late API] Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/late/posts - Update an existing post
export async function PUT(request: NextRequest) {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { postId, ...updateData } = body;
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${LATE_API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Late API] Update post error:', error);
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Late API] Update post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/late/posts?postId=xxx - Delete a post
export async function DELETE(request: NextRequest) {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${LATE_API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Late API] Delete post error:', error);
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Late API] Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
