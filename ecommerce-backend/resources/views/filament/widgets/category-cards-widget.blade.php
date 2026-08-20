@php
    $categories = $this->getCategories();
    $bgColors = [
        '#fff4e6', '#e8f4fd', '#eefbf0', '#fde8e8', '#f0ebfe', '#fffce6',
    ];
@endphp

@if($categories->isNotEmpty())
<div style="
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 4px;
">
    @foreach ($categories as $index => $category)
    @php
        $bg = $bgColors[$index % count($bgColors)];
        $imageUrl = $this->getImageUrl($category->image);
    @endphp
    <div style="
        background-color: {{ $bg }};
        border-radius: 14px;
        padding: 20px 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        border: 1px solid rgba(0,0,0,0.05);
    ">
        @if($imageUrl)
            <img
                src="{{ $imageUrl }}"
                alt="{{ $category->name }}"
                style="height: 72px; width: 72px; object-fit: contain; border-radius: 8px;"
            >
        @else
            <div style="height: 72px; width: 72px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; background: rgba(0,0,0,0.04); border-radius: 10px;">
                🏷️
            </div>
        @endif
        <div>
            <p style="font-weight: 600; font-size: 0.875rem; color: #111827; margin: 0; line-height: 1.3;">
                {{ $category->name }}
            </p>
            <p style="font-size: 0.72rem; color: #6b7280; margin: 4px 0 0;">
                {{ $category->products_count }} {{ Str::plural('product', $category->products_count) }}
            </p>
        </div>
    </div>
    @endforeach
</div>
@endif
