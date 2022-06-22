package app.geocode;

import java.util.Optional;

import app.model.Position;

public interface GeoCoder {
	Optional<Position> geocode(String street, String streetNumber, String zip, String city, String country);
}
