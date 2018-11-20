import * as React from 'react';

interface listing { title: string; id: number }
interface listingCardProps { key: number, listing: listing }

const ListingCard = (listingCardProps: listingCardProps) => (
  <h1>{listingCardProps.listing.title}</h1>
)

export default ListingCard;
