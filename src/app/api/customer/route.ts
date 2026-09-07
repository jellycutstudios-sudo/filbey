import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawPhone = searchParams.get('phone') || '';
  const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

  if (!cleanPhone || cleanPhone.length !== 10) {
    return NextResponse.json({ hasOrdered: false, error: 'Invalid phone number' }, { status: 400 });
  }

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    // If webhook is not configured yet, return false so client falls back to local storage
    return NextResponse.json({ hasOrdered: false, note: 'Google Sheet not configured' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const separator = webhookUrl.includes('?') ? '&' : '?';
    const targetUrl = `${webhookUrl}${separator}phone=${encodeURIComponent(cleanPhone)}`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ hasOrdered: false, warning: 'Failed to reach Google Sheet' });
    }

    const data = await res.json();
    return NextResponse.json({
      hasOrdered: Boolean(data.hasOrdered),
      phone: cleanPhone,
      name: data.name || '',
      address: data.address || '',
      buildingDetails: data.buildingDetails || '',
      landmark: data.landmark || '',
    });
  } catch (err) {
    console.warn('[API /api/customer GET error]:', err);
    return NextResponse.json({ hasOrdered: false, error: 'Webhook timeout or error' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, address, buildingDetails, landmark, area, total, items } = body;

    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({ success: true, savedLocally: true, note: 'Webhook URL not set' });
    }

    // Combine address parts into one string so no new Sheet columns are needed
    const fullAddress = [
      address || '',
      buildingDetails ? `Flat/Floor/Bldg: ${buildingDetails}` : '',
      landmark ? `Gate/Landmark: ${landmark}` : '',
    ].filter(Boolean).join(' | ');

    // Forward to Google Apps Script Webhook
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || '',
        phone: cleanPhone,
        address: fullAddress,
        area: area || '',
        total: total || 0,
        items: items || '',
      }),
    });

    const data = await res.json().catch(() => ({ success: true }));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.warn('[API /api/customer POST error]:', err);
    // Don't fail the customer checkout flow even if Google Sheet sync fails
    return NextResponse.json({ success: false, error: 'Could not sync to sheet' }, { status: 200 });
  }
}
