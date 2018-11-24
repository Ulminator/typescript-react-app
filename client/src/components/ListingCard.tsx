import * as React from 'react';
import { Link } from 'react-router-dom';

interface Listing { id: number; title: string; user_id: number, image_id: number, created_at: Date }

interface ListingCardProps { key: number, listing: Listing }

const ListingCard = (listingCardProps: ListingCardProps) => {
  return (
    <Link to={`/posts/${listingCardProps.listing.id}`} style={{ position: 'relative',
                                                               textDecoration: 'none',
                                                               top: 100 }}>
      <p style={{ border: '2px',
                  borderStyle: 'solid', 
                  padding: '16px', 
                  margin: '25px'}}
        id={`${listingCardProps.listing.id}`}>
          {listingCardProps.listing.title}
      </p>
    </Link>
  );
};

export default ListingCard;
